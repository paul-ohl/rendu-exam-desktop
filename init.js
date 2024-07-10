document.addEventListener('DOMContentLoaded', async () => {
  const users = await window.api.getUsers();
  const userList = document.getElementById('user-id');
  userList.innerHTML = '';
  userList.append(...users.map(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;
    return option;
  }));
})

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  window.api.sendMessage();
})

document.getElementById('login').addEventListener('click', async (_e) => {
  const userId = +document.getElementById('user-id').value;
  const chats = await window.api.getChats();
  const chatSelect = document.getElementById('chat-select');
  chatSelect.innerHTML = '';
  chatSelect.append(...chats.map(chat => {
    const option = document.createElement('option');
    option.value = chat.id;
    const innerText = chat.interlocutors
      .filter(interlocutor => interlocutor.id !== userId)
      .map(interlocutor => interlocutor.name).join(', ');
    option.innerText = innerText;
    return option;
  }));
})

document.getElementById('chat-select').addEventListener('change', (_e) => {
  const chatBox = document.getElementById('chat-content');
  chatBox.innerHTML = '';
})

document.getElementById('open-in-new-window').addEventListener('click', (_e) => {
  window.open('./childWindows/child.html', '', 'width=1280,height=720');
  window.api.openChatInNewWindow();
})
