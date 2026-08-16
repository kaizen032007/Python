const { contextBridge, ipcRenderer } = require('electron');

// We expose a secure API to the window object for React to use if needed
contextBridge.exposeInMainWorld('electronAPI', {
  getYoutubeInfo: (url) => ipcRenderer.invoke('get-youtube-info', url),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
});
