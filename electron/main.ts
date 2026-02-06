import { app, BrowserWindow, screen } from 'electron'

import path from 'path'
import { fileURLToPath } from 'node:url'
import { BrowserManager } from './services/browser-manager'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let browserManager: BrowserManager | null = null

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // 加载本地开发服务器或打包后的 dist 文件
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.resolve(__dirname, '../dist/index.html'))
  }
  // win.webContents.openDevTools({ mode: 'detach' })
  // Initialize BrowserManager to handle Webviews
  browserManager = new BrowserManager(win)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
