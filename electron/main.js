const {app, BrowserWindow, Menu, Tray,ipcMain } = require('electron')

const path = require('path')
let mainWindow = null ;
let tray = null;

//const NODE_ENV = process.env.NODE_ENV  //新增
const NODE_ENV = 'development'
function createWindow() {
  Menu.setApplicationMenu(null)
  // 创建浏览器窗口
    mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })


  // 加载 index.html
  // mainWindow.loadFile('dist/index.html') 将该行改为下面这一行，加载url
  mainWindow.loadURL(
      NODE_ENV === 'development'
          ? 'http://localhost:5173'
          :`file://${path.join(__dirname, '../dist/index.html')}`
  ); // 新增
  // 打开开发工具
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  } //这里改成自己的项目启动端口

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
  // mainWindow.webContents.openDevTools()
}

function createTray(){
  tray = new Tray(path.join(__dirname, 'icon.jpg'))
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
        app.exit()
      }
    }
  ]);

  tray.setToolTip('你的应用名称');
  tray.setContextMenu(contextMenu);
  // 添加一个点击托盘图标关闭应用的监听
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.on('vue-message', (event, data) => {
    console.log('Received message from Vue:', data);
  });
  createWindow()
  createTray()
  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})