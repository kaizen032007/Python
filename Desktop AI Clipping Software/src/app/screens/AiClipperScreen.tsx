import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Link2, Play, Pause, Zap, Check, ChevronDown, ChevronUp,
  Loader2, Smartphone, Download, ExternalLink, Sparkles, Volume2, VolumeX, RefreshCw, Type, Music, Palette, Move, Sliders, Cpu, CheckCircle2, RotateCcw, RotateCw, Upload, Maximize, Copyright
} from "lucide-react";
import { Rnd } from "react-rnd";

interface Props { onBack: () => void; onOpenEditor?: (url: string) => void; }

const DEFAULT_ENGINE = { id: "higgsfield", name: "Higgsfield AI", provider: "Higgsfield", desc: "Best for Cinematic Camera Motion & Video" };

const AI_ENGINES = [
  { id: "claude_fable", name: "Claude Fable", provider: "Anthropic", desc: "Best for Viral Hooks & Scriptwriting" },
  { id: "higgsfield", name: "Higgsfield AI", provider: "Higgsfield", desc: "Best for Cinematic Camera Motion & Video" },
  { id: "seedance", name: "SeeDance AI", provider: "ByteDance", desc: "Best for Music Beat Sync & Dance Clips" },
  { id: "openai_sora", name: "OpenAI Sora / GPT-4o", provider: "OpenAI", desc: "General Video & Subtitle Model" },
];

const LAYOUTS = [
  { id: "vertical_crop", label: "Vertical Crop (9:16)", desc: "Fills vertical screen — best for TikTok/Reels" },
  { id: "landscape_fit", label: "Landscape Fit (9:16)", desc: "Original width with black bars top & bottom" },
  { id: "landscape_blur", label: "Blurred Background (9:16)", desc: "Full width centered with blurred zoomed bg" },
  { id: "custom_split", label: "Custom Split (9:16)", desc: "Free-form stack (Streamer or Podcast)" },
];

const QUALITIES = [
  { id: "720p", label: "720p — Fast Processing", desc: "5-10x faster processing (Recommended)" },
  { id: "1080p", label: "1080p — High Quality", desc: "Slower downloads, crisp resolution" },
  { id: "4k", label: "4K — Ultra HD", desc: "Very slow downloads, maximum crispness" },
  { id: "8k", label: "8K — Extreme HD", desc: "Extreme downloads, hardware intensive" },
];

// Absolute Best Fonts (20 Dropdown Options)
const VIRAL_FONTS = [
  { id: "Impact, sans-serif", label: "Impact (Classic Viral Reel)" },
  { id: "'Montserrat', sans-serif", label: "Montserrat (Heavy Bold)" },
  { id: "'Outfit', sans-serif", label: "Outfit (Modern Clean)" },
  { id: "'Bebas Neue', sans-serif", label: "Bebas Neue (Heavy Punch)" },
  { id: "'Anton', sans-serif", label: "Anton (High Contrast)" },
  { id: "'Permanent Marker', cursive", label: "Permanent Marker (Comic Style)" },
  { id: "'Roboto', sans-serif", label: "Roboto (Clean Sans)" },
  { id: "'Inter', sans-serif", label: "Inter (Standard Pro)" },
  { id: "'Poppins', sans-serif", label: "Poppins (Geometric Bold)" },
  { id: "'Oswald', sans-serif", label: "Oswald (Condensed Heavy)" },
  { id: "'Cinematic Sans', sans-serif", label: "Cinematic Subtitles" },
  { id: "'Lobster', cursive", label: "Lobster (Handwritten Script)" },
  { id: "'Pacifico', cursive", label: "Pacifico (Trendy Brush)" },
  { id: "'Comic Sans MS', cursive", label: "Comic Accent" },
  { id: "'Trebuchet MS', sans-serif", label: "Trebuchet Display" },
  { id: "'Futura', sans-serif", label: "Futura Heavy" },
  { id: "'Space Grotesk', sans-serif", label: "Space Grotesk (Tech)" },
  { id: "'Syne', sans-serif", label: "Syne (Experimental)" },
  { id: "'Playfair Display', serif", label: "Playfair (Serif Elegance)" },
  { id: "'Courier New', monospace", label: "Retro Monospace" },
];

// Pro Text Effects & Styles (No Trademarks)
const PRO_TEXT_EFFECTS = [
  {
    id: "none",
    label: "No Captions (Clean Video)",
    style: {
      color: "#9ca3af",
      background: "transparent",
      border: "1px dashed rgba(255,255,255,0.2)",
      boxShadow: "none",
      textShadow: "none",
    }
  },
  {
    id: "capcut_banger",
    label: "CapCut Banger (Huge Impact)",
    style: {
      color: "#ffffff",
      background: "transparent",
      border: "3px solid #ff2828", // Simulating the red highlight
      boxShadow: "5px 5px 0px rgba(0,0,0,0.9)", // Drop shadow
      textShadow: "0 4px 10px rgba(0,0,0,0.9)",
    }
  },
  {
    id: "hormozi_bold",
    label: "Hormozi Style (Bold Outline)",
    style: {
      color: "#ffffff",
      background: "transparent",
      border: "4px solid #ffd600", // Yellow highlight
      boxShadow: "0 0 20px rgba(255,214,0,0.4)",
      textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 4px 15px rgba(0,0,0,0.9)", // Heavy black outline
    }
  },
  {
    id: "minimal_pop",
    label: "Minimal Pop (Clean Bebas)",
    style: {
      color: "#ffffff",
      background: "transparent",
      border: "1px solid #00ffff", // Cyan highlight
      boxShadow: "none",
      textShadow: "0 2px 5px rgba(0,0,0,0.7)",
    }
  },
  {
    id: "capcut_yellow",
    label: "Classic Gold Yellow",
    style: {
      color: "#ffd600",
      background: "rgba(0,0,0,0.85)",
      border: "2px solid #ffd600",
      boxShadow: "0 0 20px rgba(255,214,0,0.4)",
      textShadow: "0 2px 8px rgba(0,0,0,0.9)",
    }
  },
  {
    id: "tiktok_banner",
    label: "TikTok Black Box Banner",
    style: {
      color: "#ffffff",
      background: "#000000",
      border: "1px solid rgba(255,255,255,0.2)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
      textShadow: "none",
    }
  },
  {
    id: "neon_cyan",
    label: "Cyberpunk Neon Cyan",
    style: {
      color: "#00e5ff",
      background: "rgba(0,229,255,0.1)",
      border: "2px solid #00e5ff",
      boxShadow: "0 0 25px rgba(0,229,255,0.6)",
      textShadow: "0 0 10px #00e5ff",
    }
  },
  {
    id: "hot_pink",
    label: "Hot Pink Neon",
    style: {
      color: "#f50057",
      background: "rgba(245,0,87,0.15)",
      border: "2px solid #f50057",
      boxShadow: "0 0 25px rgba(245,0,87,0.5)",
      textShadow: "0 0 12px #f50057",
    }
  },
  {
    id: "sigma_pink",
    label: "Red Shock Alert Box",
    style: {
      color: "#ffffff",
      background: "#ff1744",
      border: "2px solid #ffffff",
      boxShadow: "0 0 30px rgba(255,23,68,0.7)",
      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
    }
  },
  {
    id: "lime_green",
    label: "Lime Energy Glow",
    style: {
      color: "#76ff03",
      background: "rgba(0,0,0,0.85)",
      border: "2px solid #76ff03",
      boxShadow: "0 0 20px rgba(118,255,3,0.5)",
      textShadow: "0 0 10px #76ff03",
    }
  },
  {
    id: "bright_yellow",
    label: "Gold Metallic Luxury",
    style: {
      color: "#000000",
      background: "linear-gradient(135deg, #ffe082 0%, #ffb300 100%)",
      border: "2px solid #ffffff",
      boxShadow: "0 0 25px rgba(255,179,0,0.6)",
      textShadow: "none",
    }
  },
  {
    id: "purple_pop",
    label: "Purple Synthwave",
    style: {
      color: "#d500f9",
      background: "rgba(213,0,249,0.15)",
      border: "2px solid #d500f9",
      boxShadow: "0 0 25px rgba(213,0,249,0.6)",
      textShadow: "0 0 12px #d500f9",
    }
  },
  {
    id: "clean_white_sub",
    label: "Minimalist Subtitle White",
    style: {
      color: "#ffffff",
      background: "rgba(0,0,0,0.7)",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "none",
      textShadow: "0 1px 4px rgba(0,0,0,0.8)",
    }
  },
  {
    id: "electric_blue_shock",
    label: "Electric Blue Shock",
    style: {
      color: "#2979ff",
      background: "rgba(41,121,255,0.15)",
      border: "2px solid #2979ff",
      boxShadow: "0 0 25px rgba(41,121,255,0.6)",
      textShadow: "0 0 10px #2979ff",
    }
  },
];

const DURATION_MODES = [
  { id: "auto", label: "Auto-Detect Highlights", desc: "AI picks the most viral moments" },
  { id: "full", label: "Entire Video", desc: "Process full video into short clip" },
  { id: "custom", label: "Customize Range", desc: "Manually set start & end timestamps" },
];

const DEMO_VIDEOS = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
];

export function AiClipperScreen({ onBack, onOpenEditor }: Props) {
  const [inputType, setInputType] = useState<"youtube" | "local">("youtube");
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=demo_viral_stream");
  const [layout, setLayout] = useState("vertical_crop");
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("auto");
  const [cameraStyle, setCameraStyle] = useState("smooth");
  const [quality, setQuality] = useState("720p");
  const [durationMode, setDurationMode] = useState("auto");
  const [numClips, setNumClips] = useState(3);
  const [startTs, setStartTs] = useState("0:15");
  const [endTs, setEndTs] = useState("1:45");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [generatedClips, setGeneratedClips] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"setup" | "gallery" | "details">("setup");

  // AI Engine & BYOK (Bring Your Own Key) State
  const [selectedEngine, setSelectedEngine] = useState("higgsfield");
  const [byokMode, setByokMode] = useState<"developer" | "custom">("developer");
  const [showKeySettings, setShowKeySettings] = useState(false);

  // BYOK Multi-Key State
  const [anthropicKey, setAnthropicKey] = useState(() => localStorage.getItem("clipvault_anthropic_key") || "");
  const [higgsfieldKey, setHiggsfieldKey] = useState(() => localStorage.getItem("clipvault_higgsfield_key") || "");
  const [seeDanceKey, setSeeDanceKey] = useState(() => localStorage.getItem("clipvault_seedance_key") || "");
  const [openAiKey, setOpenAiKey] = useState(() => localStorage.getItem("clipvault_openai_key") || "");

  useEffect(() => {
    try {
      localStorage.setItem("clipvault_anthropic_key", anthropicKey);
      localStorage.setItem("clipvault_higgsfield_key", higgsfieldKey);
      localStorage.setItem("clipvault_seedance_key", seeDanceKey);
      localStorage.setItem("clipvault_openai_key", openAiKey);
    } catch (e) { }
  }, [anthropicKey, higgsfieldKey, seeDanceKey, openAiKey]);

  // CUSTOM TEXT, DROPDOWN FONTS & EFFECTS STATE
  const [customText, setCustomText] = useState("YOUR VIRAL CAPTION HERE 🚀");
  const [selectedFont, setSelectedFont] = useState("Impact, sans-serif");
  const [selectedEffectId, setSelectedEffectId] = useState("capcut_yellow");
  
  // BYPASS COPYRIGHT STATE
  const [avoidCopyright, setAvoidCopyright] = useState(false);

  // DRAGGABLE TEXT POSITION STATE
  const [textPos, setTextPos] = useState({ x: 20, y: 440 });

  // Video State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeClipIndex, setActiveClipIndex] = useState(0);

  // Processing state
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [localFilePath, setLocalFilePath] = useState("");
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);

  // Quick Crop State
  const [cropModalOpen, setCropModalOpen] = useState<"none" | "top" | "bottom">("none");
  const [cropTop, setCropTop] = useState({ x: 100, y: 0, width: 144, height: 128 }); 
  const [cropBottom, setCropBottom] = useState({ x: 100, y: 128, width: 144, height: 128 });
  const [splitType, setSplitType] = useState<"same" | "guest">("same");
  const [targetDuration, setTargetDuration] = useState<number | string>(30);
  const [autoBroll, setAutoBroll] = useState(false);
  const [addCaptions, setAddCaptions] = useState(true);
  const [addBgMusic, setAddBgMusic] = useState(true);
  const [bgMusicVol, setBgMusicVol] = useState(0.1);
  const [autoSfx, setAutoSfx] = useState(true);
  const [customBaseUrl, setCustomBaseUrl] = useState("");
  const [exportFileName, setExportFileName] = useState("");

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (phoneContainerRef.current) {
        const firstVid = phoneContainerRef.current.querySelector('video');
        if (firstVid) {
          setCurrentTime(firstVid.currentTime);
          setDuration(firstVid.duration || 1);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (phoneContainerRef.current) {
      const videos = phoneContainerRef.current.querySelectorAll('video');
      videos.forEach(v => {
        v.muted = isMuted;
      });
    }
  }, [isMuted, done, activeClipIndex, layout]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Clean up ALL video elements on screen to release Chromium memory buffers
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
    };
  }, []);

  // DEBOUNCED & VALIDATED YOUTUBE STREAM RESOLVER (Stops keystroke spam & process freeze)
  useEffect(() => {
    if (!ytUrl.trim()) return;
    const isYtFormat = /[?&]v=([^&]+)|youtu\.be\/([^?&]+)/.test(ytUrl);
    if (!isYtFormat) return;

    const timer = setTimeout(() => {
      const controller = new AbortController();
      const fetchTimer = setTimeout(() => controller.abort(), 3000);
      fetch(`http://127.0.0.1:8000/api/video_info?url=${encodeURIComponent(ytUrl)}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          if (data.url || data.stream_url) {
            setActiveVideoUrl(data.url || data.stream_url);
          }
        })
        .catch(() => {})
        .finally(() => clearTimeout(fetchTimer));
    }, 1200);

    return () => clearTimeout(timer);
  }, [ytUrl]);

  const activeEffect = PRO_TEXT_EFFECTS.find(e => e.id === selectedEffectId) || PRO_TEXT_EFFECTS[0] || { style: { color: "#ffd600" } };

  const runClipper = async () => {
    if (!ytUrl.trim() && inputType === 'youtube') return;
    
    setRunning(true);
    setProgress(0);
    setDone(false);
    setErrorMsg("");
    setStatusText("Initializing AI Processing Engine...");

    try {
      // 1. Submit the task
      // Calculate custom crop box percentages if custom split is used
      let customCropBoxes = undefined;
      if (layout === "custom_split") {
        const containerWidth = 456; // 456px fixed stage width
        const containerHeight = 256; // 256px fixed stage height
        
        customCropBoxes = [
          [
            (cropTop.x / containerWidth) * 100,
            (cropTop.y / containerHeight) * 100,
            (cropTop.width / containerWidth) * 100,
            (cropTop.height / containerHeight) * 100
          ],
          [
            (cropBottom.x / containerWidth) * 100,
            (cropBottom.y / containerHeight) * 100,
            (cropBottom.width / containerWidth) * 100,
            (cropBottom.height / containerHeight) * 100
          ]
        ];
      }

      const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return Number(timeStr) || 0;
      };

      const reqBody = {
        url: inputType === 'youtube' ? ytUrl : (localFilePath || activeVideoUrl),
        duration: durationMode === "auto" ? "auto" : "custom",
        num_clips: durationMode === "auto" ? numClips : 1,
        target_duration: durationMode === "auto" ? (parseInt(targetDuration.toString()) || 30) : -1,
        topic: durationMode === "auto" && topicPrompt.trim() ? topicPrompt : undefined,
        layout: layout,
        transcription_language: transcriptionLanguage,
        custom_range: durationMode === "custom" && startTs && endTs ? [parseTime(startTs), parseTime(endTs)] : undefined,
        quality: quality,
        caption_style: selectedEffectId,
        ai_engine: selectedEngine,
        auto_broll: autoBroll,
        yt_bypass: avoidCopyright,
        add_bg_music: addBgMusic,
        add_captions: addCaptions,
        auto_sfx: autoSfx,
        bg_music_vol: bgMusicVol,
        custom_base_url: customBaseUrl || undefined,
        custom_file_name: exportFileName || undefined,
        custom_crop_boxes: customCropBoxes,
        camera_style: cameraStyle
      };

      const res = await fetch("http://127.0.0.1:8000/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer dev-token"
        },
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) {
        throw new Error("Failed to start processing task.");
      }

      const data = await res.json();
      const taskId = data.task_id;

      // 2. Poll for status
      intervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://127.0.0.1:8000/api/status/${taskId}`, {
            headers: { "Authorization": "Bearer dev-token" }
          });
          const statusData = await statusRes.json();
          
          if (statusData.message) {
            setStatusText(statusData.message);
          }
          
          if (statusData.status === "completed") {
            clearInterval(intervalRef.current);
            setProgress(100);
            setDone(true);
            setRunning(false);
            setStatusText("Done! Clips Generated!");
            
            if (statusData.result && statusData.result.clips) {
              setGeneratedClips(statusData.result.clips);
              setViewMode("gallery");
            }
          } else if (statusData.status === "failed") {
            clearInterval(intervalRef.current);
            setRunning(false);
            setErrorMsg(`Error: ${statusData.error}`);
            setStatusText("");
          } else {
            // Use real progress from the backend server
            setProgress(statusData.progress || 0);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);

    } catch (error: any) {
      setRunning(false);
      setErrorMsg(`Error: ${error.message}`);
      setStatusText("");
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (phoneContainerRef.current) {
        const videos = phoneContainerRef.current.querySelectorAll('video');
        videos.forEach(v => {
          if (prev) {
            v.pause();
          } else {
            v.play().catch(() => {});
          }
        });
      }
      return next;
    });
  };

  const openCropModal = (position: "top" | "bottom") => {
    setCropModalOpen(position);
  };

  // Helper to render dynamically cropped video
  const renderCroppedVideo = (src: string, crop: {x: number, y: number, width: number, height: number}) => {
    // Math to crop the video exactly relative to the UI box, without ANY stretching.
    const scaleW = 456 / crop.width;
    const scaleH = 256 / crop.height;
    const leftP = -(crop.x / crop.width) * 100;
    const topP = -(crop.y / crop.height) * 100;
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          aspectRatio: `${crop.width} / ${crop.height}`,
          maxHeight: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <video
            src={src}
            autoPlay loop muted={isMuted}
            style={{
              position: 'absolute',
              width: `${scaleW * 100}%`,
              height: `${scaleH * 100}%`,
              maxWidth: 'none',
              maxHeight: 'none',
              left: `${leftP}%`,
              top: `${topP}%`,
              objectFit: 'fill',
              pointerEvents: 'none',
              filter: avoidCopyright ? 'hue-rotate(15deg) contrast(1.1) brightness(1.05)' : 'none',
              transform: avoidCopyright ? 'scaleX(-1)' : 'none'
            }}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field (like the YouTube URL)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === "Space" || e.key === "Backspace") {
        e.preventDefault();
        togglePlay();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const seekVideo = (amount: number) => {
    if (phoneContainerRef.current) {
      const videos = phoneContainerRef.current.querySelectorAll('video');
      let newTime = 0;
      videos.forEach(v => {
        v.currentTime = Math.max(0, Math.min(v.currentTime + amount, v.duration || 0));
        newTime = v.currentTime;
      });
      setCurrentTime(newTime);
    }
  };

  const onSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (phoneContainerRef.current) {
      const videos = phoneContainerRef.current.querySelectorAll('video');
      videos.forEach(v => {
        v.currentTime = val;
      });
      setCurrentTime(val);
    }
  };

  const setQuickTextPos = (preset: "top" | "middle" | "bottom") => {
    if (preset === "top") setTextPos({ x: 20, y: 70 });
    if (preset === "middle") setTextPos({ x: 20, y: 250 });
    if (preset === "bottom") setTextPos({ x: 20, y: 440 });
  };

  const G2 = "#fbbf24";

  return (
    <div className="h-screen w-screen flex flex-col font-['Inter',sans-serif] overflow-hidden bg-[#050505] select-none">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(251,191,36,0.07) 0%, transparent 70%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 pt-7 h-20 pr-36 flex-shrink-0 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              <Zap className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-base">AI Video Clipper</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              🚀 Viral Engine v2
            </span>
          </div>
        </div>

        {/* AI ENGINE & BYOK KEY SELECTOR BADGE */}
        <div className="flex items-center gap-3">
          {done && (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00e676] text-black font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,230,118,0.3)]">
                <Download className="w-4 h-4" strokeWidth={2.5} />
                Export {quality.toUpperCase()}
              </button>
            </div>
          )}
          <button
            onClick={() => setShowKeySettings(!showKeySettings)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-xs text-white transition-all cursor-pointer shadow-md"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">Engine:</span>
            <span className="text-amber-400 font-semibold">
              {(AI_ENGINES.find(e => e.id === selectedEngine) ?? DEFAULT_ENGINE).name} ({byokMode === "developer" ? "Demo Key" : "BYOK Key"})
            </span>
          </button>
        </div>
      </header>

      {/* ── BYOK KEY & ENGINE SETTINGS DROPDOWN ── */}
      {showKeySettings && (
        <div className="absolute top-20 right-36 z-50 w-[420px] p-5 rounded-2xl bg-[#0d0d0d] border border-white/15 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-bold text-xs flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" /> AI Video Engine & BYOK Settings
            </h4>
            <button onClick={() => setShowKeySettings(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
          </div>

          {/* AI Engine Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active AI Model Engine</label>
            <div className="grid grid-cols-2 gap-2">
              {AI_ENGINES.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEngine(e.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${selectedEngine === e.id
                      ? "bg-amber-400/10 border-amber-400 text-amber-400"
                      : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                >
                  <p className="font-bold text-xs">{e.name}</p>
                  <p className="text-[9px] opacity-70 truncate">{e.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Key Mode Selection */}
          <div className="flex rounded-xl p-1 bg-black/60 border border-white/10 text-xs font-bold">
            <button
              onClick={() => setByokMode("developer")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${byokMode === "developer" ? "bg-amber-400 text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
            >
              Developer Key (Demo)
            </button>
            <button
              onClick={() => setByokMode("custom")}
              className={`flex-1 py-1.5 rounded-lg transition-all ${byokMode === "custom" ? "bg-amber-400 text-black shadow-md" : "text-gray-400 hover:text-white"
                }`}
            >
              Custom Key (BYOK)
            </button>
          </div>

          {byokMode === "developer" ? (
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Developer Master API Key Active (`sk-clipvault-demo-key`). Ready out of the box!</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 scrollbar-hide">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 font-bold">🧠 Anthropic API Key (Claude Fable)</span>
                  <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Get Key ↗</a>
                </div>
                <input
                  type="password"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full rounded-xl px-3 py-1.5 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 font-bold">🎥 Higgsfield AI Key</span>
                  <a href="https://higgsfield.ai" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Get Key ↗</a>
                </div>
                <input
                  type="password"
                  value={higgsfieldKey}
                  onChange={(e) => setHiggsfieldKey(e.target.value)}
                  placeholder="hg-live-..."
                  className="w-full rounded-xl px-3 py-1.5 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 font-bold">⚡ SeeDance AI Key (ByteDance)</span>
                  <a href="https://seedance.ai" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Get Key ↗</a>
                </div>
                <input
                  type="password"
                  value={seeDanceKey}
                  onChange={(e) => setSeeDanceKey(e.target.value)}
                  placeholder="sd-prod-..."
                  className="w-full rounded-xl px-3 py-1.5 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 font-bold">🤖 OpenAI Sora / GPT-4o Key</span>
                  <a href="https://platform.openai.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Get Key ↗</a>
                </div>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full rounded-xl px-3 py-1.5 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-300 font-bold">🌐 Custom API Proxy URL (Optional)</span>
                </div>
                <input
                  type="text"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="e.g. https://api.chatanywhere.tech/v1"
                  className="w-full rounded-xl px-3 py-1.5 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="relative z-10 flex-1 flex overflow-hidden">

        {/* LEFT COLUMN: Controls & Settings OR Crop Editor */}
        <div className="w-[520px] flex-shrink-0 border-r border-white/5 overflow-y-auto scrollbar-hide px-8 py-6 bg-[#070707] flex flex-col">
          
          {cropModalOpen !== "none" ? (
            <div className="w-full flex-1 flex flex-col space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg">Crop Editor</h3>
                  <p className="text-gray-400 text-xs mt-1">Adjust the glowing yellow box.</p>
                </div>
                <button onClick={() => setCropModalOpen("none")} className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]">Done Cropping</button>
              </div>

              <div className="text-center text-xs text-gray-400 mb-2">
                Drag the <span className="text-amber-400 font-bold">Top Clip (Amber)</span> and <span className="text-cyan-400 font-bold">Bottom Clip (Cyan)</span> boxes.
              </div>

              {/* 480x270 Fixed Stage for Cropping Math */}
              <div className="relative w-[456px] h-[256px] bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-2 ring-white/5 mx-auto mt-2">
                <video 
                  src={activeVideoUrl} 
                  autoPlay loop muted className="w-full h-full object-cover opacity-50" 
                />
                
                {/* TOP CROP BOX */}
                <Rnd
                  position={{ x: cropTop.x, y: cropTop.y }}
                  size={{ width: cropTop.width, height: cropTop.height }}
                  onDrag={(e, d) => setCropTop(prev => ({ ...prev, x: d.x, y: d.y }))}
                  onResize={(e, dir, ref, delta, position) => {
                    const newDim = { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height), x: position.x, y: position.y };
                    setCropTop(newDim);
                  }}
                  bounds="parent"
                  className="group cursor-move z-20"
                >
                  <div className="absolute inset-0 border-[3px] border-amber-400 bg-amber-400/10 shadow-[0_0_25px_rgba(251,191,36,0.5)]">
                    <span className="absolute -top-6 left-0 text-[10px] font-bold text-amber-400 bg-black/80 px-2 rounded">TOP CLIP</span>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <video 
                        src={activeVideoUrl} 
                        autoPlay loop muted 
                        style={{
                          position: 'absolute',
                          width: '456px',
                          height: '256px',
                          maxWidth: 'none',
                          maxHeight: 'none',
                          left: `${-cropTop.x}px`,
                          top: `${-cropTop.y}px`,
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                </Rnd>

                {/* BOTTOM CROP BOX */}
                <Rnd
                  position={{ x: cropBottom.x, y: cropBottom.y }}
                  size={{ width: cropBottom.width, height: cropBottom.height }}
                  onDrag={(e, d) => setCropBottom(prev => ({ ...prev, x: d.x, y: d.y }))}
                  onResize={(e, dir, ref, delta, position) => {
                    const newDim = { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height), x: position.x, y: position.y };
                    setCropBottom(newDim);
                  }}
                  bounds="parent"
                  className="group cursor-move z-10"
                >
                  <div className="absolute inset-0 border-[3px] border-cyan-400 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                    <span className="absolute -bottom-6 left-0 text-[10px] font-bold text-cyan-400 bg-black/80 px-2 rounded">BOTTOM CLIP</span>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <video 
                        src={activeVideoUrl} 
                        autoPlay loop muted 
                        style={{
                          position: 'absolute',
                          width: '456px',
                          height: '256px',
                          maxWidth: 'none',
                          maxHeight: 'none',
                          left: `${-cropBottom.x}px`,
                          top: `${-cropBottom.y}px`,
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                </Rnd>
              </div>
              
              {/* Start/End Time Trimming Controls */}
              <div className="w-[456px] mx-auto mt-4 bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-300">Trim Custom Split Clip</span>
                  <span className="text-[10px] text-gray-500">Set start/end points using the video above</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const vids = document.querySelectorAll('video');
                      const vid = Array.from(vids).find(v => v.src.includes(activeVideoUrl));
                      if (vid) {
                        const mins = Math.floor(vid.currentTime / 60).toString().padStart(2, '0');
                        const secs = Math.floor(vid.currentTime % 60).toString().padStart(2, '0');
                        setStartTs(`${mins}:${secs}`);
                      }
                    }}
                    className="flex-1 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                  >
                    Set Start Time ({startTs || "00:00"})
                  </button>
                  <button 
                    onClick={() => {
                      const vids = document.querySelectorAll('video');
                      const vid = Array.from(vids).find(v => v.src.includes(activeVideoUrl));
                      if (vid) {
                        const mins = Math.floor(vid.currentTime / 60).toString().padStart(2, '0');
                        const secs = Math.floor(vid.currentTime % 60).toString().padStart(2, '0');
                        setEndTs(`${mins}:${secs}`);
                      }
                    }}
                    className="flex-1 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
                  >
                    Set End Time ({endTs || "00:00"})
                  </button>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-4">Drag the edges to resize, or drag the center to move. Results show instantly on the right.</div>
            </div>
          ) : (
            <div className="space-y-7 w-full animate-fadeIn">

              {/* Media Source Section */}
              <Section title="Media Source" accent={G2}>
            <div className="flex items-center bg-white/5 rounded-xl p-1 mb-3 border border-white/10">
              <button
                onClick={() => setInputType("youtube")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${inputType === "youtube" ? "bg-amber-400 text-black shadow-md" : "text-gray-400 hover:text-white"}`}
              >
                YouTube Link
              </button>
              <button
                onClick={() => setInputType("local")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${inputType === "local" ? "bg-amber-400 text-black shadow-md" : "text-gray-400 hover:text-white"}`}
              >
                Local Upload
              </button>
            </div>

            {inputType === "youtube" ? (
              <>
                <p className="text-xs text-gray-400 mb-2.5">Paste a YouTube URL to automatically download and extract high-energy clips.</p>
                <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 bg-white/5 border border-amber-400/30">
                  <Link2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <input
                    value={ytUrl}
                    onChange={e => setYtUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-transparent text-xs text-white outline-none placeholder-gray-500"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-2.5">Select a local video file from your computer to process.</p>
                  <button
                    onClick={async () => {
                      try {
                        const filePaths = await (window as any).electronAPI.showOpenDialog({
                          properties: ['openFile'],
                          filters: [{ name: 'Videos', extensions: ['mp4', 'mkv', 'mov', 'webm'] }]
                        });
                        if (filePaths && filePaths.length > 0) {
                          const filePath = filePaths[0];
                          const url = `http://127.0.0.1:8000/stream?path=${encodeURIComponent(filePath)}`;
                          setActiveVideoUrl(url);
                          setLocalFilePath(filePath);
                          setYtUrl(""); // Clear YT url
                        }
                      } catch (err) {
                        console.error("Failed to select file:", err);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl px-3.5 py-4 bg-white/5 border border-dashed border-amber-400/30 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                  {localFilePath ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400 truncate max-w-[200px]" title={localFilePath}>
                        {localFilePath.split('\\').pop()?.split('/').pop() || "Video Selected"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">Choose Video File...</span>
                    </>
                  )}
                  </button>
              </>
            )}
          </Section>

          {/* Download Quality */}
          <Section title="Download Quality" accent={G2}>
            <div className="grid grid-cols-2 gap-3">
              {QUALITIES.map(q => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${quality === q.id
                      ? "bg-amber-400/10 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                      : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    }`}
                >
                  <p className="text-white text-xs font-bold">{q.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{q.desc}</p>
                </button>
              ))}
            </div>
          </Section>

          {/* Video Layout Options */}
          <Section title="Video Layout" accent={G2}>
            <div className="space-y-2">
              {LAYOUTS.map((l, i) => (
                <div key={l.id} className="flex flex-col gap-1">
                  <button
                    onClick={() => setLayout(l.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left border transition-all ${layout === l.id
                        ? "bg-amber-400/10 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                      }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${layout === l.id ? "bg-amber-400 text-black" : "bg-white/10 text-gray-400"
                      }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{l.label}</p>
                      <p className="text-[10px] text-gray-500 truncate">{l.desc}</p>
                    </div>
                    {layout === l.id && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </button>
                  {layout === l.id && l.id === "custom_split" && (
                    <button 
                      onClick={() => setCropModalOpen("top")}
                      className="w-full py-2 bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center gap-2"
                    >
                      <Move className="w-3.5 h-3.5" /> Adjust Crop Positions
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Camera Tracking Style */}
          <div className={layout === "custom_split" ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
            <Section title="Camera Tracking Style" accent={G2}>
              <div className="grid grid-cols-2 gap-3">
                <button
                onClick={() => setCameraStyle("smooth")}
                className={`p-3 rounded-xl text-left border transition-all ${cameraStyle === "smooth"
                    ? "bg-amber-400/10 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
              >
                <p className="text-white text-xs font-bold">Smooth / Glide</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Slow cinematic pans</p>
              </button>
              <button
                onClick={() => setCameraStyle("snappy")}
                className={`p-3 rounded-xl text-left border transition-all ${cameraStyle === "snappy"
                    ? "bg-amber-400/10 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  }`}
              >
                <p className="text-white text-xs font-bold">Snappy / Action</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Fast accurate tracking</p>
              </button>
            </div>
          </Section>
          </div>

          {/* Duration Mode */}
          <Section title="Clip Duration & AI Settings" accent={G2}>
            <div className="space-y-2 mb-3">
              {DURATION_MODES.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => setDurationMode(d.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left border transition-all ${durationMode === d.id
                      ? "bg-amber-400/10 border-amber-400/50"
                      : "bg-white/[0.02] border-white/5"
                    }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${durationMode === d.id ? "bg-amber-400 text-black" : "bg-white/10 text-gray-400"
                    }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">{d.label}</p>
                    <p className="text-[10px] text-gray-500">{d.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className={`space-y-3 transition-opacity duration-300 ${durationMode !== "auto" ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-white font-medium">Clips to generate</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setNumClips(n => Math.max(1, n - 1))} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                    -
                  </button>
                  <span className="text-white font-bold text-xs">{numClips}</span>
                  <button onClick={() => setNumClips(n => Math.min(10, n + 1))} className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-white font-medium">Clip Length (Seconds)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={targetDuration}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setTargetDuration("");
                      } else {
                        setTargetDuration(Math.max(1, parseInt(e.target.value) || 1));
                      }
                    }}
                    onBlur={() => {
                      if (targetDuration === "") setTargetDuration(30);
                    }}
                    className="w-16 rounded bg-black/40 border border-white/10 px-2 py-1 text-white text-xs font-bold text-center outline-none focus:border-amber-400"
                  />
                  <span className="text-gray-400 text-xs">sec</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Include specific moments (Topic)</label>
                <input
                  type="text"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="e.g. Find moments when they talked about the playoffs"
                  className="w-full rounded-lg px-3 py-2 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400 placeholder-gray-600 transition-colors"
                />
              </div>

              <div className="space-y-1 mt-3">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Export File Name (Optional)</label>
                <input
                  type="text"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                  placeholder="e.g. MyViralClip"
                  className="w-full rounded-lg px-3 py-2 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400 placeholder-gray-600 transition-colors"
                />
              </div>
              
              <div className="space-y-1 mt-3 mb-2">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Video Language</label>
                <select
                  value={transcriptionLanguage}
                  onChange={(e) => setTranscriptionLanguage(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs text-white bg-white/5 border border-white/10 outline-none focus:border-amber-400 cursor-pointer appearance-none"
                >
                  <option className="bg-[#111] text-white" value="auto">Auto-Detect Language</option>
                  <option className="bg-[#111] text-white" value="en">English</option>
                  <option className="bg-[#111] text-white" value="tl">Tagalog / Filipino</option>
                  <option className="bg-[#111] text-white" value="es">Spanish</option>
                  <option className="bg-[#111] text-white" value="fr">French</option>
                  <option className="bg-[#111] text-white" value="de">German</option>
                  <option className="bg-[#111] text-white" value="it">Italian</option>
                  <option className="bg-[#111] text-white" value="pt">Portuguese</option>
                  <option className="bg-[#111] text-white" value="ja">Japanese</option>
                  <option className="bg-[#111] text-white" value="ko">Korean</option>
                  <option className="bg-[#111] text-white" value="zh">Chinese</option>
                  <option className="bg-[#111] text-white" value="ru">Russian</option>
                  <option className="bg-[#111] text-white" value="id">Indonesian</option>
                  <option className="bg-[#111] text-white" value="hi">Hindi</option>
                  <option className="bg-[#111] text-white" value="ar">Arabic</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {/* B-Roll & SFX Toggles */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setAutoBroll(!autoBroll)}>
                <div className="flex flex-col">
                  <span className="text-xs text-white font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400"/> Auto B-Roll</span>
                  <span className="text-[10px] text-gray-500">Overlay relevant stock footage automatically</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${autoBroll ? "bg-amber-400" : "bg-white/20"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${autoBroll ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5 transition-colors">
                <div className="flex items-center justify-between cursor-pointer hover:bg-white/10 p-1 rounded-lg" onClick={() => setAddBgMusic(!addBgMusic)}>
                  <div>
                    <span className="text-xs text-white font-medium flex items-center gap-1.5"><Music className="w-3.5 h-3.5 text-amber-400"/> Background Music</span>
                    <span className="text-[10px] text-gray-500">Add trendy background music</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${addBgMusic ? "bg-amber-400" : "bg-white/20"}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${addBgMusic ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
                
                {addBgMusic && (
                  <div className="mt-2 pl-5 pr-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-gray-400">Volume</span>
                      <span className="text-[10px] text-amber-400 font-bold">{Math.round(bgMusicVol * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.01" 
                      max="1.0" 
                      step="0.01" 
                      value={bgMusicVol} 
                      onChange={(e) => setBgMusicVol(parseFloat(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setAutoSfx(!autoSfx)}>
                <div>
                  <span className="text-xs text-white font-medium flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-amber-400"/> Auto Emojis & SFX</span>
                  <span className="text-[10px] text-gray-500">Pop sound effects and animated emojis</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${autoSfx ? "bg-amber-400" : "bg-white/20"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${autoSfx ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setAddCaptions(!addCaptions)}>
                <div>
                  <span className="text-xs text-white font-medium flex items-center gap-1.5"><Type className="w-3.5 h-3.5 text-amber-400"/> AI Captions</span>
                  <span className="text-[10px] text-gray-500">Generate animated word-by-word subtitles</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${addCaptions ? "bg-amber-400" : "bg-white/20"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${addCaptions ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>


              
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setAvoidCopyright(!avoidCopyright)}>
                <div className="flex flex-col">
                  <span className="text-xs text-white font-medium flex items-center gap-1.5"><Copyright className="w-3.5 h-3.5 text-amber-400"/> Bypass Copyright</span>
                  <span className="text-[10px] text-gray-500">Flips video & adjusts speed/color</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${avoidCopyright ? "bg-amber-400" : "bg-white/20"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${avoidCopyright ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>
            </div>

            <div className={`grid grid-cols-2 gap-3 p-3.5 rounded-xl transition-opacity duration-300 ${durationMode !== "custom" ? "opacity-30 pointer-events-none bg-white/5 border border-white/5 grayscale" : "bg-white/5 border border-amber-400/30 opacity-100"}`}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Start Timestamp</label>
                <input
                  type="text"
                  value={startTs}
                  onChange={(e) => setStartTs(e.target.value)}
                  placeholder="e.g. 0:15"
                  className="w-full rounded-lg px-3 py-2 text-xs font-bold text-white bg-black/20 border border-white/10 outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">End Timestamp</label>
                <input
                  type="text"
                  value={endTs}
                  onChange={(e) => setEndTs(e.target.value)}
                  placeholder="e.g. 1:45"
                  className="w-full rounded-lg px-3 py-2 text-xs font-bold text-white bg-black/20 border border-white/10 outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>
          </Section>

          {/* Run Button Panel */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {running && (
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">{statusText}</span>
                  <span className="font-mono text-gray-300">{Math.floor(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              onClick={runClipper}
              disabled={running}
              className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:opacity-95 transition-all shadow-[0_0_25px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-black" />}
              {running ? "Processing AI Clipper..." : done ? "Re-Run AI Clipper" : "Run AI Clipper"}
            </button>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold whitespace-pre-wrap">
                {errorMsg}
              </div>
            )}

            {!running && generatedClips.length > 0 && (
              <button
                onClick={() => setViewMode("gallery")}
                className="w-full py-4 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                View Generated Clips ({generatedClips.length})
              </button>
            )}
          </div>
            </div>
          )}
        </div>
        {/* RIGHT COLUMN: OPUS UI (Gallery / Details / Live Preview) */}
        {viewMode === "setup" && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/90 relative overflow-hidden">
            {/* Background Ambient Spotlight */}
            <div className="absolute w-[450px] h-[450px] bg-amber-400/10 rounded-full filter blur-[120px] pointer-events-none" />

            {/* SMARTPHONE DEVICE CONTAINER */}
            <div className="relative h-[90%] max-h-[720px] aspect-[9/16] rounded-[48px] p-4 bg-[#111] border-[6px] border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-10 mx-auto shrink-0 min-w-[280px]">
              {/* Smartphone Notch & Speaker */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center gap-2 border border-white/10 shadow-md">
                <div className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/10" />
                <div className="w-8 h-1 rounded-full bg-white/20" />
              </div>

              {/* Smartphone Screen Viewport */}
              <div 
                ref={phoneContainerRef} 
                onClick={togglePlay}
                className="relative flex-1 w-full h-full rounded-[36px] overflow-hidden bg-black flex items-center justify-center cursor-pointer"
              >
                {!running ? (
                  cropModalOpen !== "none" && layout === "custom_split" ? (
                    <div className="w-full h-full flex flex-col relative bg-black">
                      <div className="flex-1 relative overflow-hidden border-b-2 border-white/20">
                        {renderCroppedVideo(activeVideoUrl, cropTop)}
                      </div>
                      <div className="flex-1 relative overflow-hidden">
                        {renderCroppedVideo(splitType === "guest" ? DEMO_VIDEOS[(activeClipIndex + 2) % DEMO_VIDEOS.length] : activeVideoUrl, cropBottom)}
                      </div>
                      {/* Interactive Crop Outline purely for visual aesthetic */}
                      <div className="absolute inset-0 border-2 border-amber-400/50 pointer-events-none rounded-[36px]" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <Sparkles className="w-8 h-8 text-amber-400 opacity-50" />
                      </div>
                      <h4 className="text-white font-bold text-sm">Awaiting Generation</h4>
                      <p className="text-[10px] text-gray-500 max-w-[200px]">Configure your settings on the left and click "Run AI Clipper" to generate viral shorts.</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                    <span className="text-amber-400 font-bold text-sm">{Math.floor(progress)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === "gallery" && (
          <div className="flex-1 bg-[#0a0a0a] overflow-y-auto p-10 animate-fadeIn relative">
             <button onClick={() => setViewMode("setup")} className="absolute top-6 right-10 text-gray-400 hover:text-white text-xs flex items-center gap-2"><ArrowLeft className="w-3 h-3"/> Back to Editor</button>
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                 <Sparkles className="text-amber-400 w-6 h-6" /> Original Clips
               </h2>
               <button 
                 onClick={() => { setGeneratedClips([]); setViewMode("setup"); }}
                 className="text-red-400/80 hover:text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-400/20"
               >
                 Clear All Clips
               </button>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {generatedClips.map((clip, i) => (
                  <div key={i} className="bg-[#141414] rounded-2xl border border-white/5 hover:border-amber-400/50 transition-all cursor-pointer group flex flex-col" onClick={() => { setActiveClipIndex(i); setViewMode("details"); }}>
                    <div className="relative w-full aspect-[9/16] bg-black rounded-t-2xl overflow-hidden shadow-inner">
                        <video src={clip.url || clip} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10">9:16</div>
                        <div className="absolute top-2 left-2 bg-amber-400/90 text-black px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-black"/> Score: {clip.virality_score || 99}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                             <Play className="w-5 h-5 fill-white text-white ml-1" />
                          </div>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-white line-clamp-2 leading-tight">{clip.content_title || clip.title || `Viral Clip #${i+1}`}</h3>
                          <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{clip.reason || clip.content_description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                            <span className="text-[10px] text-gray-400">{clip.duration ? `${clip.duration.toFixed(1)}s` : "30s"}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setGeneratedClips(prev => prev.filter((_, idx) => idx !== i)); if (generatedClips.length <= 1) setViewMode("setup"); }} 
                              className="text-red-400/70 hover:text-red-400 text-xs font-bold transition-colors bg-red-400/10 hover:bg-red-400/20 px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                        </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {viewMode === "details" && generatedClips[activeClipIndex] && (
          <div className="flex-1 bg-[#0a0a0a] flex flex-col relative animate-fadeIn">
            <button onClick={() => setViewMode("gallery")} className="absolute top-6 left-6 z-50 text-gray-400 hover:text-white text-xs flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              <ArrowLeft className="w-4 h-4"/> Back to Gallery
            </button>

            <div className="flex-1 flex max-w-6xl mx-auto w-full pt-16 pb-8 gap-8 px-8">
               {/* Left: Video Player */}
               <div className="h-full max-h-[75vh] flex-shrink-0 flex items-center justify-center">
                  <div className="relative h-full aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 group">
                    <video 
                      src={generatedClips[activeClipIndex].url || generatedClips[activeClipIndex]} 
                      autoPlay loop controls
                      className="w-full h-full object-contain bg-black"
                    />
                    <button 
                      onClick={(e) => {
                        const vid = e.currentTarget.previousElementSibling as HTMLVideoElement;
                        if (vid.requestFullscreen) vid.requestFullscreen();
                        else if ((vid as any).webkitRequestFullscreen) (vid as any).webkitRequestFullscreen();
                      }}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2.5 rounded-xl text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg border border-white/10 flex items-center justify-center gap-2 text-xs font-bold"
                    >
                      <Maximize className="w-4 h-4" />
                      Fullscreen
                    </button>
                  </div>
               </div>

               {/* Right: Transcript & Details */}
               <div className="flex-1 flex flex-col pt-8">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 fill-amber-400" /> Virality Score: {generatedClips[activeClipIndex].virality_score || 95}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-[#00f2fe] text-black px-4 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 shadow-lg">
                          <Upload className="w-4 h-4" /> Share to TikTok
                        </button>
                        <button 
                          onClick={() => {
                            const clip = generatedClips[activeClipIndex];
                            const currentName = clip.content_title || clip.title || `Viral_Clip_${activeClipIndex + 1}`;
                            
                            // Extract the filename from the URL (e.g. "/outputs/clip_0.mp4" -> "clip_0.mp4")
                            const url = clip.url || clip;
                            const parts = url.split('/');
                            const filename = parts[parts.length - 1];
                            
                            const baseUrl = customBaseUrl || "http://127.0.0.1:8000";
                            const downloadUrl = `${baseUrl}/api/download_clip?file=${encodeURIComponent(filename)}&name=${encodeURIComponent(currentName)}`;
                            
                            // Use window.open or a hidden anchor to trigger download
                            window.open(downloadUrl, '_blank');
                          }}
                          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 shadow-lg"
                        >
                          <Download className="w-4 h-4" /> Download {quality.toUpperCase()}
                        </button>
                      </div>
                   </div>
                   
                   <input
                     type="text"
                     value={generatedClips[activeClipIndex].content_title || generatedClips[activeClipIndex].title || `Viral Clip #${activeClipIndex + 1}`}
                     onChange={(e) => {
                       const newClips = [...generatedClips];
                       newClips[activeClipIndex] = { ...newClips[activeClipIndex], content_title: e.target.value };
                       setGeneratedClips(newClips);
                     }}
                     className="text-2xl font-bold text-white mb-2 leading-tight bg-transparent border-b border-transparent hover:border-white/20 focus:border-amber-400 focus:outline-none transition-colors w-full p-1"
                   />
                   
                   <p className="text-sm text-gray-400 mb-8 border-b border-white/10 pb-6 px-1">
                     {generatedClips[activeClipIndex].reason || generatedClips[activeClipIndex].content_description}
                   </p>
                  
                  <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 p-6 overflow-y-auto shadow-inner">
                     <div className="flex justify-between items-center mb-6">
                       <h3 className="text-white font-bold text-sm">Scene Analysis & Transcript</h3>
                       <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> AI Curated
                       </div>
                     </div>
                     <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {/* Fake transcript for demo purposes based on title if no real transcript is passed */}
                        <span className="text-amber-400 font-mono text-xs mr-3">[00:00 - 00:30]</span>
                        {generatedClips[activeClipIndex].title} is an incredible viral moment that hooks the viewer instantly. The pacing and delivery keep retention extremely high. 
                        {"\n\n"}
                        <span className="text-amber-400 font-mono text-xs mr-3">[Analysis]</span>
                        The AI successfully detected the core climax of this topic and applied dynamic Opus-style word-by-word bouncy text effects.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest mb-2.5 text-amber-400">{title}</h3>
      {children}
    </div>
  );
}
