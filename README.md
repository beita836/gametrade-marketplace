<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GameTrade - 登录 / 注册</title>
  <style>
    * { box-sizing: border-box; }
    :root {
      --primary: #4568ff;
      --primary-dark: #2d4fe0;
      --bg: linear-gradient(135deg, #4568ff 0%, #7b4ae2 100%);
      --card: rgba(255,255,255,0.96);
      --text: #1d2433;
      --muted: #5b6b82;
      --danger: #d63d3d;
      --line: #dde8ff;
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      color: var(--text);
      padding: 20px;
    }
    .auth-box {
      width: min(420px, 100%);
      background: var(--card);
      border-radius: 24px;
      box-shadow: 0 30px 60px rgba(24, 34, 70, 0.22);
      padding: 28px 22px;
    }
    h2 {
      margin: 0 0 24px;
      text-align: center;
      font-size: 2rem;
      line-height: 1.2;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 700;
      color: #36455d;
    }
    input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--line);
      background: #f8faff;
      border-radius: 12px;
      font-size: 1rem;
      outline: none;
    }
    input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(69, 104, 255, 0.12);
    }
    .btn {
      width: 100%;
      padding: 12px 14px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary), #5d73ff);
      color: white;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
      transition: 0.2s ease;
    }
    .btn:hover {
      filter: brightness(1.04);
    }
    .link {
      color: var(--primary);
      font-weight: 700;
      cursor: pointer;
    }
    .muted {
      color: var(--muted);
      font-size: 0.92rem;
    }
    .toggle-text {
      margin-top: 18px;
      text-align: center;
      color: var(--muted);
    }
    .hidden { display: none; }
    .error {
      display: none;
      margin-top: 12px;
      color: var(--danger);
      background: rgba(214, 61, 61, 0.08);
      border-left: 4px solid var(--danger);
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.92rem;
    }
    .error.show { display: block; }
    .loading { opacity: 0.7; cursor: wait; }
    .badge {
      display: inline-block;
      background: rgba(69, 104, 255, 0.08);
      color: var(--primary-dark);
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="auth-box">
    <div id="loginForm">
      <div class="badge">无需邮箱验证</div>
      <h2>🎮 GameTrade</h2>
      <div class="form-group">
        <label for="loginEmail">邮箱</label>
        <input id="loginEmail" type="email" placeholder="your@email.com" />
      </div>
      <div class="form-group">
        <label for="loginPassword">密码</label>
        <input id="loginPassword" type="password" placeholder="••••••••" />
      </div>
      <button id="loginBtn" class="btn">登录</button>
      <div id="loginError" class="error"></div>
      <div class="toggle-text">没有账号？ <span class="link" id="showRegister">立即注册</span></div>
    </div>

    <div id="registerForm" class="hidden">
      <div class="badge">快速注册</div>
      <h2>🎮 注册</h2>
      <div class="form-group">
        <label for="registerUsername">用户名</label>
        <input id="registerUsername" type="text" placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label for="registerEmail">邮箱</label>
        <input id="registerEmail" type="email" placeholder="your@email.com" />
      </div>
      <div class="form-group">
        <label for="registerPassword">密码</label>
        <input id="registerPassword" type="password" placeholder="至少6位" />
      </div>
      <div class="form-group">
        <label for="registerConfirm">确认密码</label>
        <input id="registerConfirm" type="password" placeholder="重复密码" />
      </div>
      <button id="registerBtn" class="btn">注册</button>
      <div id="registerError" class="error"></div>
      <div class="toggle-text">已有账号？ <span class="link" id="showLogin">立即登录</span></div>
    </div>
  </div>

  <script type="module">
    import { registerUser, loginUser, getCurrentUser } from './supabase-config.js';

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    function showError(target, message, visible = true) {
      target.textContent = message;
      target.classList.toggle('show', visible);
    }

    function showLogin() {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      showError(loginError, '', false);
      showError(registerError, '', false);
    }

    function showRegister() {
      registerForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      showError(loginError, '', false);
      showError(registerError, '', false);
    }

    document.getElementById('showRegister').addEventListener('click', showRegister);
    document.getElementById('showLogin').addEventListener('click', showLogin);

    document.getElementById('loginBtn').addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const btn = document.getElementById('loginBtn');
      btn.classList.add('loading');
      btn.disabled = true;

      const result = await loginUser(email, password);

      btn.classList.remove('loading');
      btn.disabled = false;

      if (result.success) {
        window.location.href = 'index.html';
      } else {
        showError(loginError, result.error, true);
      }
    });

    document.getElementById('registerBtn').addEventListener('click', async () => {
      const username = document.getElementById('registerUsername').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const confirm = document.getElementById('registerConfirm').value;
      const btn = document.getElementById('registerBtn');

      if (!username || !email || !password || !confirm) {
        showError(registerError, '请填写所有字段', true);
        return;
      }
      if (password.length < 6) {
        showError(registerError, '密码至少需要 6 个字符', true);
        return;
      }
      if (password !== confirm) {
        showError(registerError, '两次输入的密码不一致', true);
        return;
      }

      btn.classList.add('loading');
      btn.disabled = true;

      const result = await registerUser(email, password, username);

      btn.classList.remove('loading');
      btn.disabled = false;

      if (result.success) {
        showError(registerError, '', false);
        alert('注册成功，已直接登录。');
        window.location.href = 'index.html';
      } else {
        showError(registerError, result.error, true);
      }
    });

    const user = await getCurrentUser();
    if (user) {
      window.location.href = 'index.html';
    }
  </script>
</body>
</html>
