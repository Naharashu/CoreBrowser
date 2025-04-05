const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('close-window'),
    openDevTools: () => ipcRenderer.send('open-devtools'),
    saveHistory: (url) => ipcRenderer.invoke('save-history', url),
    getHistory: () => ipcRenderer.invoke('get-history'),
    clearHistory: () => ipcRenderer.invoke('clear-history'),
    loadURL: (url) => ipcRenderer.send('load-url', url)
})