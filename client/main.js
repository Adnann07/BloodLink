// Fade-up animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Trigger for elements already visible on page load
window.addEventListener('load', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});

// Ask AI chat
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

function scrollToBottom() {
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg-user';
  div.innerHTML = `<div class="msg-user-bubble">${text}</div>`;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function addAIMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg-ai';
  div.innerHTML = `
    <span class="msg-avatar">🩸</span>
    <div class="msg-bubble">${text}</div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg-ai';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <span class="msg-avatar">🩸</span>
    <div class="msg-bubble">...</div>
  `;
  chatMessages.appendChild(div);
  scrollToBottom();
}

function hideTyping() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

async function askGroq(userMessage) {
  showTyping();

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful blood donation assistant for BloodLink. Answer questions in the same language the user writes in — if they write in Bangla, reply in Bangla; if they write in English, reply in English. Only answer questions related to blood donation, eligibility, blood types, donation process, and related health topics. Keep answers short and clear.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    hideTyping();
    addAIMessage(data.choices[0].message.content);

  } catch (error) {
    hideTyping();
    addAIMessage('Sorry, something went wrong. Please try again.');
  }
}

function sendMessage() {
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  addUserMessage(text);
  askGroq(text);
}

function sendChip(btn) {
  const text = btn.textContent;
  addUserMessage(text);
  askGroq(text);
}

function handleKey(e) {
  if (e.key === 'Enter') sendMessage();
}