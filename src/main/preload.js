const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveCsv: (csvContent, filename) => ipcRenderer.invoke('save-csv', csvContent, filename),
  loadCsv: (filename) => ipcRenderer.invoke('load-csv', filename),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config')
}) 