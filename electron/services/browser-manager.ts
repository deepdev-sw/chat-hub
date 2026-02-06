import { BrowserView, BrowserWindow, ipcMain } from 'electron'
import { adapters, ModelAdapter } from '../adapters'

export class BrowserManager {
  private views: Map<string, BrowserView> = new Map()
  private mainWindow: BrowserWindow

  constructor(window: BrowserWindow) {
    this.mainWindow = window
    this.initViews()
    this.setupIPC()
  }

  private initViews() {
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

    adapters.forEach(adapter => {
      const view = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          // sandbox: true
        }
      })
      this.mainWindow.addBrowserView(view)
      view.webContents.setUserAgent(userAgent)
      view.webContents.loadURL(adapter.url)
      
      // Inject CSS if provided by adapter
      if (adapter.css) {
        view.webContents.on('did-finish-load', () => {
          view.webContents.insertCSS(adapter.css!)
          // view.webContents.setZoomFactor(0.7) // Shrink content to fit split screen
          // DevTools removed for production feel
          // view.webContents.openDevTools({ mode: 'detach' })
        })
      } else {
        view.webContents.on('did-finish-load', () => {
          // view.webContents.setZoomFactor(0.7)
          // view.webContents.openDevTools({ mode: 'detach' })
        })
      }

      this.views.set(adapter.name, view)
    })
    
    this.updateLayout()
    
    // Update layout on resize
    this.mainWindow.on('resize', () => {
      this.updateLayout()
    })
  }

  private updateLayout() {
    const bounds = this.mainWindow.getContentBounds()
    const sidebarWidth = 60
    const inputHeight = 80
    const contentWidth = bounds.width - sidebarWidth
    const contentHeight = bounds.height - inputHeight
    const viewWidth = Math.floor(contentWidth / this.views.size)

    let xOffset = sidebarWidth
    let index = 0
    
    this.views.forEach((view) => {
      view.setBounds({
        x: xOffset + (index * viewWidth),
        y: 0,
        width: viewWidth,
        height: contentHeight
      })
      // view.setAutoResize({ width: true, height: true }) // Can be tricky with manual layout
      index++
    })
  }

  private setupIPC() {
    ipcMain.on('chat:send', async (event, message) => {
      console.log('Received message to send:', message)
      for (const adapter of adapters) {
        const view = this.views.get(adapter.name)
        if (view) {
          try {
            // 1. Fill Input
            await view.webContents.executeJavaScript(adapter.getFillInputCode(message))
            // 2. Wait a bit (optional, but good for UI updates)
            await new Promise(r => setTimeout(r, 100))
            // 3. Click Send
            await view.webContents.executeJavaScript(adapter.getSendCode())
          } catch (error) {
            console.error(`Failed to send to ${adapter.name}:`, error)
          }
        }
      }
    })

    ipcMain.on('chat:reset', async () => {
      for (const adapter of adapters) {
        const view = this.views.get(adapter.name)
        if (view) {
          try {
            await view.webContents.executeJavaScript(adapter.getResetCode())
          } catch (error) {
            console.error(`Failed to reset ${adapter.name}:`, error)
          }
        }
      }
    })
  }
}
