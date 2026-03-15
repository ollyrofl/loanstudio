(function () {
  'use strict';

  const ENDPOINT = '/.netlify/functions/chat';

  const WELCOME = "G'day! I'm the Loan Studio assistant. Ask me anything about home loans, refinancing, investment properties, or our services — I'm here to help!";

  // ── Styles ────────────────────────────────────────────────────────────────
  const css = `
    #ls-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: #cddf5e;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.35);
      transition: transform 0.2s, background 0.2s;
    }
    #ls-chat-btn:hover { transform: scale(1.08); background: #d9e96e; }
    #ls-chat-btn svg { width: 26px; height: 26px; color: #071a1a; }

    #ls-chat-panel {
      position: fixed;
      bottom: 100px;
      right: 28px;
      z-index: 9998;
      width: 360px;
      max-width: calc(100vw - 32px);
      max-height: 520px;
      background: #0f2e2e;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      transform: translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    #ls-chat-panel.ls-open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    #ls-chat-header {
      background: #071a1a;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    #ls-chat-header .ls-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #cddf5e;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #ls-chat-header .ls-avatar svg { width: 18px; height: 18px; color: #071a1a; }
    #ls-chat-header .ls-title { flex: 1; }
    #ls-chat-header .ls-title strong {
      display: block;
      color: #fff;
      font-size: 14px;
      font-family: sans-serif;
      font-weight: 600;
    }
    #ls-chat-header .ls-title span {
      color: #cddf5e;
      font-size: 11px;
      font-family: sans-serif;
    }
    #ls-chat-close {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      padding: 4px;
      line-height: 1;
      transition: color 0.15s;
    }
    #ls-chat-close:hover { color: #fff; }
    #ls-chat-close svg { width: 18px; height: 18px; }

    #ls-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.15) transparent;
    }
    #ls-chat-messages::-webkit-scrollbar { width: 4px; }
    #ls-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    .ls-msg {
      max-width: 82%;
      padding: 10px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      font-family: sans-serif;
    }
    .ls-msg.ls-bot {
      align-self: flex-start;
      background: #163b3b;
      color: rgba(255,255,255,0.9);
      border-bottom-left-radius: 4px;
    }
    .ls-msg.ls-user {
      align-self: flex-end;
      background: #cddf5e;
      color: #071a1a;
      font-weight: 500;
      border-bottom-right-radius: 4px;
    }
    .ls-msg.ls-typing {
      background: #163b3b;
      color: rgba(255,255,255,0.5);
      align-self: flex-start;
      font-style: italic;
      font-size: 13px;
    }

    #ls-chat-footer {
      padding: 12px;
      background: #071a1a;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    #ls-chat-input {
      flex: 1;
      background: #163b3b;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      color: #fff;
      font-size: 13.5px;
      font-family: sans-serif;
      padding: 9px 13px;
      outline: none;
      resize: none;
      height: 40px;
      max-height: 100px;
      overflow-y: auto;
      transition: border-color 0.15s;
    }
    #ls-chat-input::placeholder { color: rgba(255,255,255,0.35); }
    #ls-chat-input:focus { border-color: rgba(205,223,94,0.5); }

    #ls-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: #cddf5e;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s, transform 0.1s;
    }
    #ls-chat-send:hover { background: #d9e96e; }
    #ls-chat-send:active { transform: scale(0.95); }
    #ls-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
    #ls-chat-send svg { width: 17px; height: 17px; color: #071a1a; }

    #ls-chat-disclaimer {
      text-align: center;
      font-size: 10px;
      color: rgba(255,255,255,0.25);
      font-family: sans-serif;
      padding: 0 12px 8px;
      background: #071a1a;
    }
  `;

  // ── HTML ──────────────────────────────────────────────────────────────────
  function buildUI() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Floating button
    const btn = document.createElement('button');
    btn.id = 'ls-chat-btn';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    document.body.appendChild(btn);

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'ls-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Loan Studio');
    panel.innerHTML = `
      <div id="ls-chat-header">
        <div class="ls-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M12 12h.01"/></svg>
        </div>
        <div class="ls-title">
          <strong>Loan Studio</strong>
          <span>AI assistant · online</span>
        </div>
        <button id="ls-chat-close" aria-label="Close chat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div id="ls-chat-messages"></div>
      <div id="ls-chat-footer">
        <textarea id="ls-chat-input" placeholder="Ask about home loans…" rows="1"></textarea>
        <button id="ls-chat-send" aria-label="Send">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div id="ls-chat-disclaimer">AI responses are general information only. For personalised advice, speak with a broker.</div>
    `;
    document.body.appendChild(panel);
  }

  // ── State & Logic ─────────────────────────────────────────────────────────
  let history = [];
  let isOpen = false;
  let isLoading = false;

  function addMessage(text, type) {
    const messages = document.getElementById('ls-chat-messages');
    const div = document.createElement('div');
    div.className = 'ls-msg ls-' + type;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function removeTyping() {
    const typing = document.querySelector('.ls-typing');
    if (typing) typing.remove();
  }

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;

    isLoading = true;
    const sendBtn = document.getElementById('ls-chat-send');
    const input = document.getElementById('ls-chat-input');
    sendBtn.disabled = true;
    input.disabled = true;

    addMessage(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = addMessage('Typing…', 'typing');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
      });

      const data = await res.json();
      removeTyping();

      if (data.error) {
        addMessage("Sorry, something went wrong. Please try again or call us on 1300 978 051.", 'bot');
      } else {
        addMessage(data.content, 'bot');
        history.push({ role: 'assistant', content: data.content });
      }
    } catch (err) {
      removeTyping();
      addMessage("Sorry, I couldn't connect. Please call us on 1300 978 051.", 'bot');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }

  function togglePanel() {
    isOpen = !isOpen;
    const panel = document.getElementById('ls-chat-panel');
    if (isOpen) {
      panel.classList.add('ls-open');
      document.getElementById('ls-chat-input').focus();
    } else {
      panel.classList.remove('ls-open');
    }
  }

  function init() {
    buildUI();

    // Show welcome message
    addMessage(WELCOME, 'bot');
    history = [];

    // Button toggle
    document.getElementById('ls-chat-btn').addEventListener('click', togglePanel);
    document.getElementById('ls-chat-close').addEventListener('click', togglePanel);

    // Send on button click
    document.getElementById('ls-chat-send').addEventListener('click', () => {
      const input = document.getElementById('ls-chat-input');
      const text = input.value.trim();
      if (text) {
        input.value = '';
        input.style.height = '40px';
        sendMessage(text);
      }
    });

    // Send on Enter (Shift+Enter for newline)
    document.getElementById('ls-chat-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = e.target.value.trim();
        if (text) {
          e.target.value = '';
          e.target.style.height = '40px';
          sendMessage(text);
        }
      }
    });

    // Auto-resize textarea
    document.getElementById('ls-chat-input').addEventListener('input', (e) => {
      e.target.style.height = '40px';
      e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
