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
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful blood donation assistant for BloodLink. Only answer questions related to blood donation, eligibility, blood types, donation process, and related health topics. Keep answers short and clear.'
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

// Auth
const API_URL = 'http://localhost:8000/api';

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs = document.querySelectorAll('.auth-tab');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabs[1].classList.add('active');
    tabs[0].classList.remove('active');
  }
}

function handleRoleChange() {
  const role = document.getElementById('regRole').value;
  const donorFields = document.getElementById('donorFields');
  const hospitalFields = document.getElementById('hospitalFields');

  donorFields.classList.add('hidden');
  hospitalFields.classList.add('hidden');

  if (role === 'donor') donorFields.classList.remove('hidden');
  if (role === 'hospital') hospitalFields.classList.remove('hidden');
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorEl = document.getElementById('loginError');

  errorEl.textContent = '';

  if (!email || !password) {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.message || 'Login failed. Please try again.';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    const role = data.user.role;
    if (role === 'admin') window.location.href = 'admin-dashboard.html';
    else if (role === 'donor') window.location.href = 'donor-dashboard.html';
    else if (role === 'hospital') window.location.href = 'hospital-dashboard.html';

  } catch (error) {
    errorEl.textContent = 'Something went wrong. Please try again.';
  }
}

async function handleRegister() {
  const errorEl = document.getElementById('registerError');
  errorEl.textContent = '';

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const role = document.getElementById('regRole').value;

  if (!name || !email || !password || !role) {
    errorEl.textContent = 'Please fill in all required fields.';
    return;
  }

  const body = { name, email, password, role, phone };

  if (role === 'donor') {
    body.blood_group = document.getElementById('regBloodGroup').value;
    body.date_of_birth = document.getElementById('regDob').value;
    body.gender = document.getElementById('regGender').value;
    body.weight_kg = document.getElementById('regWeight').value;

    if (!body.blood_group || !body.date_of_birth || !body.gender) {
      errorEl.textContent = 'Please fill in all donor fields.';
      return;
    }
  }

  if (role === 'hospital') {
    body.hospital_name = document.getElementById('regHospitalName').value.trim();
    body.city = document.getElementById('regCity').value.trim();
    body.license_number = document.getElementById('regLicense').value.trim();

    if (!body.hospital_name || !body.city) {
      errorEl.textContent = 'Please fill in all hospital fields.';
      return;
    }
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      errorEl.textContent = data.message || 'Registration failed. Please try again.';
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    const userRole = data.user.role;
    if (userRole === 'admin') window.location.href = 'admin-dashboard.html';
    else if (userRole === 'donor') window.location.href = 'donor-dashboard.html';
    else if (userRole === 'hospital') window.location.href = 'hospital-dashboard.html';

  } catch (error) {
    errorEl.textContent = 'Something went wrong. Please try again.';
  }
}