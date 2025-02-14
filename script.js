document.addEventListener('DOMContentLoaded', () => {
  const homePage = document.getElementById('homePage');
  const chatPage = document.getElementById('chatPage');
  const startChatBtn = document.getElementById('startChatBtn');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const messageContainer = document.getElementById('messageContainer');

  startChatBtn.addEventListener('click', () => {
    homePage.classList.add('hidden');
    chatPage.classList.remove('hidden');
  });

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('input', autoExpand);

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      displayMessage(message, 'self');
      messageInput.value = '';
      messageInput.style.height = 'auto';
    }
  }

  function displayMessage(msg, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    if (type === 'self') msgDiv.classList.add('self');
    msgDiv.innerText = msg;
    messageContainer.appendChild(msgDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  function autoExpand() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  }
});
