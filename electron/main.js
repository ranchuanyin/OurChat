const {app, BrowserWindow, Menu, Tray, ipcMain, nativeImage} = require('electron')
let request = require('request')
const path = require('path')
const {createWriteStream} = require("fs");
let mainWindow = null;
let tray = null;
let timer = null;
let icon = path.join(__dirname, 'icon.jpg')

//新增
//const NODE_ENV = 'development'
function createWindow() {
    Menu.setApplicationMenu(null)
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        minWidth: 1000,
        minHeight: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })


    // 加载 index.html
    // mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
    mainWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`);
    //mainWindow.loadURL('http://localhost:5173'); // 新增
    // 打开开发工具
    //这里改成自己的项目启动端口

    mainWindow.on('close', (event) => {
        // 阻止窗口关闭
        event.preventDefault();

        // 隐藏窗口
        mainWindow.hide();
    });

    // 监听窗口关闭后的事件，释放窗口资源
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 打开开发工具
    mainWindow.webContents.openDevTools()
}

function createTray() {
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '打开应用',
            click: () => {
                mainWindow.show();
            }
        },
        {
            label: '退出',
            click: () => {
                tray.destroy();
                app.quit()
            }
        }
    ]);

    tray.setToolTip('你的应用名称');
    tray.setContextMenu(contextMenu);
    // 添加一个点击托盘图标关闭应用的监听
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {

    ipcMain.on('avatarList', (event, data) => {
        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
            request(data[i]).pipe(
                createWriteStream(path.join(__dirname, `avatar/${data[i].match(/\/([^\/?#]+)$/)[1]}`))
            )
        }
    })

    let count = 0
    ipcMain.on('vue-message', (event, data) => {
        clearInterval(timer)
        timer = null
        count = 0
        if (process.platform === 'win32' || process.platform === 'win64') {
            tray.displayBalloon({
                icon: path.join(__dirname, `avatar/${data.avatar.match(/\/([^\/?#]+)$/)[1]}`),
                title: data.username,
                content: data.message
            })
        }
        timer = setInterval(() => {
            count += 1
            if (count % 2 === 0) {
                tray.setImage(icon)
            } else {
                tray.setImage(nativeImage.createEmpty()) // 创建一个空的nativeImage实例
            }
            tray.setToolTip('您有一条新消息')
        }, 500)
    });
    ipcMain.on('window-min', function () {
        mainWindow.minimize();
    })
//接收最大化命令
    ipcMain.on('window-max', function () {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    })
//接收关闭命令
    ipcMain.on('window-close', function () {
        mainWindow.hide();
    })
    createWindow()
    createTray()
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            tray.setImage(icon)
            clearInterval(timer)
            timer = null
            count = 0
        }
    });

})
app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
