import asyncio
import sys

# Silence harmless Windows asyncio ConnectionResetError spam
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import uuid
import sys
import os
from pathlib import Path

# Force UTF-8 encoding for stdout on Windows to prevent charmap errors with emojis
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.video_processor import VideoProcessor
from services.auth_verifier import AuthVerifier

app = FastAPI(
    title="AI Video Clipping Engine API",
    description="Local API backend for AI clipping and movie summarizing",
    version="1.0.0"
)

# Enable CORS for frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

auth_verifier = AuthVerifier()

from config import OUTPUT_DIR
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

# In-memory database to store background task status
tasks_db = {}

class ProcessRequest(BaseModel):
    url: str
    num_clips: int = 1
    target_duration: int = -1
    topic: Optional[str] = None
    layout: str = "vertical_crop"
    split_screen: bool = False
    movie_recap: bool = False
    quality: str = "720p"
    yt_bypass: bool = False
    tts_voice: str = "en-US-ChristopherNeural"
    tts_pitch: str = "-20Hz"
    tts_rate: str = "+0%"
    custom_range: Optional[List[float]] = None
    add_bg_music: Optional[bool] = True
    add_captions: Optional[bool] = True
    hook_text: Optional[str] = None
    transcription_language: Optional[str] = "auto"
    lyrc_promo: Optional[bool] = False
    custom_range_filter: Optional[List[float]] = None
    filter_profile: Optional[str] = 'default'
    apply_exposure_flashes: Optional[bool] = False
    apply_streamer_shake: Optional[bool] = False
    facecam_pos: Optional[str] = 'top_left'
    custom_file_name: Optional[str] = None
    auto_sfx: Optional[bool] = False
    bg_music_vol: Optional[float] = 0.1
    custom_crop_boxes: Optional[List[List[float]]] = None
    caption_style: str = "sigma_pink"
    ai_engine: str = "openai_sora" # New parameter for AI Engine selection
    camera_style: str = "smooth"

def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Security dependency that validates the JWT OAuth token passed in the Authorization header.
    Falls back to dev-user if SUPABASE_JWT_SECRET is empty.
    """
    if not os.environ.get("SUPABASE_JWT_SECRET"):
        return {
            "sub": "dev-user-id-12345",
            "email": "dev@clippingapp.com",
            "user_metadata": {"full_name": "Dev User"}
        }

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header format (must be 'Bearer <token>')")
    token = authorization.split(" ")[1]
    user = auth_verifier.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid OAuth token credentials")
    return user

def execute_rendering_task(task_id: str, request: ProcessRequest):
    """
    Worker task running inside the thread pool to execute clip generation.
    """
    try:
        tasks_db[task_id]["message"] = "Initializing video processor..."
        processor = VideoProcessor(caption_style=request.caption_style, ai_engine=request.ai_engine)
        
        # Determine topic selection filter
        custom_range_filter = request.custom_range_filter
        
        tasks_db[task_id]["message"] = "Downloading and rendering clips (this may take a few minutes)..."
        
        def on_progress(message, percent):
            tasks_db[task_id]["message"] = message
            tasks_db[task_id]["progress"] = percent
            
        outputs, title = processor.process_video(
            url=request.url,
            num_clips=request.num_clips,
            target_duration=request.target_duration,
            topic=request.topic,
            layout=request.layout,
            split_screen=request.split_screen,
            movie_recap=request.movie_recap,
            quality=request.quality,
            yt_bypass=request.yt_bypass,
            tts_voice=request.tts_voice,
            tts_pitch=request.tts_pitch,
            tts_rate=request.tts_rate,
            custom_range=request.custom_range,
            add_bg_music=request.add_bg_music,
            add_captions=request.add_captions,
            hook_text=request.hook_text,
            lyrc_promo=request.lyrc_promo,
            custom_range_filter=custom_range_filter,
            filter_profile=request.filter_profile,
            apply_exposure_flashes=request.apply_exposure_flashes,
            apply_streamer_shake=request.apply_streamer_shake,
            facecam_pos=request.facecam_pos,
            custom_file_name=request.custom_file_name,
            auto_sfx=request.auto_sfx,
            bg_music_vol=request.bg_music_vol,
            custom_crop_boxes=request.custom_crop_boxes,
            camera_style=request.camera_style,
            transcription_language=request.transcription_language,
            progress_callback=on_progress
        )
        
        tasks_db[task_id]["status"] = "completed"
        tasks_db[task_id]["progress"] = 100
        tasks_db[task_id]["message"] = "Clips successfully generated!"
        
        # Convert absolute paths to relative /outputs URLs for the frontend
        # Outputs is a list of absolute paths (or dicts if we return rich data, assuming strings here)
        output_urls = []
        for out in outputs:
            if isinstance(out, (str, Path)):
                filename = Path(out).name
                output_urls.append(f"http://127.0.0.1:8000/outputs/{filename}")
            elif isinstance(out, dict) and "path" in out:
                filename = Path(out["path"]).name
                out["url"] = f"http://127.0.0.1:8000/outputs/{filename}"
                output_urls.append(out)
        
        tasks_db[task_id]["result"] = {
            "title": title,
            "clips": output_urls
        }
        
    except Exception as e:
        tasks_db[task_id]["status"] = "failed"
        tasks_db[task_id]["error"] = str(e)
        tasks_db[task_id]["message"] = f"Error during processing: {e}"

@app.get("/api/video_info")
def get_video_info(url: str, current_user: dict = Depends(get_current_user)):
    """
    Extracts video metadata (title, duration, uploader) without downloading.
    """
    import yt_dlp
    try:
        ydl_opts = {'quiet': True, 'no_warnings': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            stream_url = None
            formats = info.get("formats", [])
            
            # Look for progressive MP4 format (video + audio together)
            # Prefer 360p (format_id 18) for smooth preview loading
            for fmt in formats:
                if fmt.get("ext") == "mp4" and fmt.get("acodec") != "none" and fmt.get("vcodec") != "none":
                    stream_url = fmt.get("url")
                    if fmt.get("format_id") == "18":
                        break
            
            # Fallback to first available URL
            if not stream_url and formats:
                for fmt in formats:
                    if fmt.get("url"):
                        stream_url = fmt.get("url")
                        break

            return {
                "title": info.get("title", "Unknown Video"),
                "duration": info.get("duration", 0),
                "author": info.get("uploader", "Unknown Channel"),
                "stream_url": stream_url
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch video info: {e}")

from fastapi.responses import FileResponse
import urllib.parse

@app.get("/api/download_clip")
def download_clip(file: str, name: str):
    """
    Downloads a generated clip with a custom filename.
    """
    import os
    file_path = OUTPUT_DIR / file
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
        
    safe_name = "".join([c for c in name if c.isalpha() or c.isdigit() or c==' ']).rstrip()
    if not safe_name:
        safe_name = "Viral_Clip"
    safe_name = safe_name.replace(" ", "_") + ".mp4"
    
    return FileResponse(path=file_path, filename=safe_name, media_type='video/mp4')

@app.get("/stream")
def stream_video_file(path: str):
    import os
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, media_type="video/mp4", headers={"Accept-Ranges": "bytes"})

@app.get("/api/health")
def health_check():
    """Simple API health check endpoint."""
    return {"status": "ok", "app": "AI Video Clipper Engine"}

@app.post("/api/process")
def process_video_endpoint(
    request: ProcessRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Submits a new clipping task to run asynchronously in the background.
    Protected endpoint: requires a valid Google/Discord Supabase JWT token.
    """
    task_id = str(uuid.uuid4())
    tasks_db[task_id] = {
        "status": "processing",
        "progress": 0,
        "message": "Queued task...",
        "result": None,
        "error": None,
        "user_email": current_user.get("email")
    }
    
    background_tasks.add_task(execute_rendering_task, task_id, request)
    return {"task_id": task_id, "status": "processing", "message": "Task queued successfully"}

@app.get("/api/status/{task_id}")
def get_task_status(task_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retrieves the execution status and progress of a background clipping task.
    Protected endpoint: requires valid authentication.
    """
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task ID not found")
    
    return tasks_db[task_id]
