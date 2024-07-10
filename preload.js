const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getChats: () => {
    const userId = document.getElementById('user-id').value;
    return ipcRenderer.invoke('get-chats', userId);
  },
  getUsers: () => {
    return ipcRenderer.invoke('get-users');
  },
  getUserById: (id) => {
    return ipcRenderer.invoke('get-user-by-id', id);
  },
  sendMessage: () => {
    const userId = document.getElementById('user-id').value;
    const chatBox = document.getElementById('chat-box');
    const msg = document.getElementById('chat-select').value;
    ipcRenderer.send('send-message', chatBox.value, msg, userId);
    chatBox.value = '';
  },
  openChatInNewWindow: () => {
    const chatSelected = document.getElementById('chat-select').value;
    ipcRenderer.send('open-chat-in-new-window', chatSelected);
  }
})

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('main-window-ready');
})

ipcRenderer.on('new-message', async (_e, chatId, message, senderId) => {
  const chatSelected = document.getElementById('chat-select').value;
  const currentUser = document.getElementById('user-id').value;
  const sender = await ipcRenderer.invoke('get-user-by-id', senderId);
  const senderName = (currentUser == senderId) ? "You" : sender.name;
  if (chatId == chatSelected) {
    const chatBox = document.getElementById('chat-content');
    const newMessage = document.createElement('li');
    newMessage.innerText += `${senderName}: ${message}\n`;
    chatBox.append(newMessage);
  } else {
    ipcRenderer.send('notify', `You received a new message from ${senderName}`);
  }
  ipcRenderer.invoke('is-window-focused').then((isWindowFocused) => {
    if (!isWindowFocused) {
      ipcRenderer.send('notify', `You received a new message from ${senderName}`);
    }
  });
})
