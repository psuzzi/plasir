import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

const isDev = process.argv.includes('--dev')

let mainWindow: BrowserWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  return result.canceled ? null : result.filePaths[0]
})

ipcMain.handle('save-csv', async (_, csvContent: string, filename: string) => {
  try {
    const configPath = path.join(os.homedir(), '.product-scanner-config.json')
    let dataFolder = path.join(os.homedir(), 'ProductScannerData')
    
    // Read saved folder preference
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      dataFolder = config.dataFolder || dataFolder
    }
    
    // Ensure folder exists
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder, { recursive: true })
    }
    
    const filePath = path.join(dataFolder, filename)
    fs.writeFileSync(filePath, csvContent, 'utf8')
    return { success: true, path: filePath }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('load-csv', async (_, filename: string) => {
  try {
    const configPath = path.join(os.homedir(), '.product-scanner-config.json')
    let dataFolder = path.join(os.homedir(), 'ProductScannerData')
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      dataFolder = config.dataFolder || dataFolder
    }
    
    const filePath = path.join(dataFolder, filename)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return { success: true, content }
    }
    return { success: false, error: 'File not found' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('save-config', async (_, config: any) => {
  try {
    const configPath = path.join(os.homedir(), '.product-scanner-config.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
})

ipcMain.handle('load-config', async () => {
  try {
    const configPath = path.join(os.homedir(), '.product-scanner-config.json')
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      return { success: true, config }
    }
    return { success: false, error: 'Config not found' }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}) 