const { ipcRenderer } = require('electron');

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  window.api.sendMessage();
})

// Listen for messages from the main window
ipcRenderer.on('open-chat-in-new-window', (_event, message) => {
  console.log('Message from main window:', message);
  // Display the conversation message
  document.getElementById('chat-content').innerText = message;
});

// // Function to send a message back to the main window (if needed)
// function sendMessageToMain(message) {
//   ipcRenderer.send('message-from-child', message);
// }

