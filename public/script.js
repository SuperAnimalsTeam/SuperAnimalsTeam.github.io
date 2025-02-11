const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');

// 获取消息
async function fetchMessages() {
    const response = await fetch('/api/messages');
    const messages = await response.json();
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.textContent = `${msg.sender}: ${msg.text}`;
        messagesDiv.appendChild(messageElement);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message, sender: '匿名用户' })
        });
        messageInput.value = '';
        fetchMessages();
    }
}

// 初始化
fetchMessages();
setInterval(fetchMessages, 200); // 每秒刷新消息