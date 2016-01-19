'use strict';
const electron = require('electron');
const menubar = require('menubar');
const dialog = require('dialog');

const ipc = electron.ipcMain;
const Menu = electron.Menu;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

const mb = menubar({
    width: 800,
    height: 800,
    'always-on-top': true,
    preloadWindow: true
});

mb.on('ready', function() {
    console.log('Ready!');

    ipc.on('open-dialog', function(event) {
        const dirPaths = dialog.showOpenDialog(
            mb.window,
            {properties: ['openDirectory']}
        );
        event.sender.send('open-dialog-reply', dirPaths);
    });

    ipc.on('quit-app', function() {
        mb.app.quit();
    });

    ipc.on('minimize', function() {
        mb.window.minimize();
    });

    mb.tray.setToolTip('JotKick');

    const menuTemplate = [{
        label: "JotKick",
        submenu: [
            {
                label: "Edit",
                submenu: [
                    {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
                    {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
                    {type: "separator"},
                    {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
                    {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
                    {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
                    {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
                ],
            },
            {type: 'separator'},
            {label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: mb.app.quit}
        ]
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});
