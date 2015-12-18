'use strict';
const electron = require('electron');
const menubar = require('menubar');
const dialog = require('dialog');

const ipc = electron.ipcMain;
const Menu = electron.Menu;

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const mb = menubar({
    width: 800,
    height: 800,
    preloadWindow: true
});

mb.on('ready', function() {
    console.log('Ready!');

    ipc.on('open-dialog', function() {
        const dirPaths = dialog.showOpenDialog(
            mb.window,
            {properties: ['openDirectory']}
        );
        event.sender.send('open-dialog-reply', dirPaths);
    });

    ipc.on('quit-app', function() {
        mb.app.quit(); 
    });

    mb.tray.setToolTip('JotKick');
});
