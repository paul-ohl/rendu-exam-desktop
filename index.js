'use strict'

const { app, BrowserWindow } = require('electron');
const path = require('path');

const NOTIFICATION_TITLE = 'Whysapp';

const { ipcMain, webContents, Notification } = require('electron');
const io = require('socket.io-client');
const socket = io(`http://localhost:3000`);

let users = [];

const mainWindow = () => {
  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    }
  });

  window.on('ready-to-show', window.show);

  window.loadFile('index.html');
  window.on('close', (event) => {
    event.preventDefault();
    window.minimize();
  });
}

app.whenReady().then(() => {
  mainWindow();
})

socket.on('user-list', (usersFromBack) => {
  users = usersFromBack;
})

app.on('window-all-closed', (event) => {
  event.preventDefault();
  // if (process.platform !== 'darwin') app.quit();
})

ipcMain
  .on('main-window-ready', (_e) => {
  })
  .on('send-message', (_e, message, conversationId, senderId) => {
    socket.emit(`conversation-${conversationId}`, message, senderId);
  })
  .on('notify', (_e, msg) => {
    new Notification({
      title: NOTIFICATION_TITLE,
      body: msg,
    }).show();
  })

ipcMain
  .handle('get-chats', (_e, userId) => {
    return new Promise((resolve, _reject) => {
      socket.emit(`order-${userId}`, 'chats')
      socket.on(`order-${userId}`, (chats) => {
        // Setup listeners for each chat
        for (const chat of chats) {
          socket.on(`conversation-${chat.id}`, (message, senderId) => {
            webContents.getAllWebContents().forEach((wc) => {
              wc.send('new-message', chat.id, message, senderId);
            });
          });
        }
        resolve(chats);
      });
    });
  });

ipcMain.handle('is-window-focused', (_e) => true);

ipcMain.handle('get-users', () => users);
ipcMain.handle('get-user-by-id', (_e, userId) => users.find((user) => user.id == userId));
