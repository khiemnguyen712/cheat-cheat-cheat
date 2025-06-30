const { app, BrowserWindow, globalShortcut } = require('electron')
const WebSocket = require('ws')

let mainWindow
let isVisible = true

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 200,
        height: 50, // Determines the Height of the windows
        x: 0, // Determines the horizontal position of the windows
        y: 0, // Determines the vertical position of the windows
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true, // Prevents window from appearing on taskbar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    mainWindow.loadFile('index.html')
    mainWindow.setIgnoreMouseEvents(true, { forward: true })

    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:8080')
    ws.on('message', (data) => {
        mainWindow.webContents.send('update-text', data.toString())
    })

    // Register keyboard shortcut to toggle visibility (Ctrl + D)
    globalShortcut.register('Control+D', () => {
        if (isVisible) {
            mainWindow.hide()
            isVisible = false
        } else {
            mainWindow.show()
            isVisible = true
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
        globalShortcut.unregisterAll()
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})
