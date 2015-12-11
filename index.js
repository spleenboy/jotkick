'use strict';
const electron = require('electron');
const dialog = require('dialog');
const app = electron.app;
const ipc = electron.ipcMain;

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
    // dereference the window
    // for multiple windows store them in an array
    mainWindow = null;
}

function createMainWindow() {
    const win = new electron.BrowserWindow({
        width: 600,
        height: 400
    });

    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate-with-no-open-windows', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    mainWindow = createMainWindow();

    ipc.on('open-dialog', function(event, arg) {
        const dirPaths = dialog.showOpenDialog(
            mainWindow,
            {properties: ['openDirectory']}
        );
        event.sender.send('open-dialog-reply', dirPaths);
    });
});
