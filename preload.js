const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    switchToFloating: () => ipcRenderer.send('switch-to-floating'),
    switchToMain: () => ipcRenderer.send('switch-to-main')
});
