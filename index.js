'use strict';
const ipc = require('electron').ipcMain;
const menubar = require('menubar');
const dialog = require('dialog');

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

    ipc.on('open-dialog', function(event, arg) {
        const dirPaths = dialog.showOpenDialog(
            mb.window,
            {properties: ['openDirectory']}
        );
        event.sender.send('open-dialog-reply', dirPaths);
    });
});
