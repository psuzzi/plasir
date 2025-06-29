import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  saveCsv: (csvContent: string, filename: string) => ipcRenderer.invoke('save-csv', csvContent, filename),
  loadCsv: (filename: string) => ipcRenderer.invoke('load-csv', filename),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config')
}) 