const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let floatingWindow = null;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        alwaysOnTop: false,
        frame: true,
        resizable: true,
        title: 'ADHD专注浏览器'
    });

    mainWindow.loadFile('index.html');

    // 开发模式下打开开发者工具
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createFloatingWindow() {
    floatingWindow = new BrowserWindow({
        width: 320,
        height: 400,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        title: '专注计时器'
    });

    floatingWindow.loadFile('floating.html');

    floatingWindow.on('closed', () => {
        floatingWindow = null;
    });
}

// 创建菜单
function createMenu() {
    const template = [
        {
            label: '窗口',
            submenu: [
                {
                    label: '主窗口',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.show();
                        } else {
                            createMainWindow();
                        }
                    }
                },
                {
                    label: '悬浮窗',
                    click: () => {
                        if (floatingWindow) {
                            floatingWindow.show();
                        } else {
                            createFloatingWindow();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: '退出',
                    role: 'quit'
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        // 可以添加关于对话框
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createMainWindow();
    createMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC通信：切换到悬浮窗模式
ipcMain.on('switch-to-floating', () => {
    if (!floatingWindow) {
        createFloatingWindow();
    }
    if (mainWindow) {
        mainWindow.hide();
    }
});

// IPC通信：切换到主窗口模式
ipcMain.on('switch-to-main', () => {
    if (!mainWindow) {
        createMainWindow();
    }
    mainWindow.show();
    if (floatingWindow) {
        floatingWindow.close();
    }
});
