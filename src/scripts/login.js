const supabaseLogin = window.supabase.createClient(
  window.SUPABASE_URL || '',
  window.SUPABASE_ANON_KEY || ''
);

(async function redirectIfLoggedIn() {
  const { data } = await supabaseLogin.auth.getSession();
  if (data.session) {
    window.location.href = './app.html';
  }
})();

const emailEl = document.getElementById('login-email');
const passwordEl = document.getElementById('login-password');
const msgEl = document.getElementById('login-message');

function setLoginMsg(text, type = 'info') {
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.style.color = type === 'error' ? '#ffb4b4' : type === 'success' ? '#b6ffb4' : '#cfd9da';
}

document.getElementById('login-btn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  setLoginMsg('Signing you in...');

  const email = (emailEl?.value || '').trim();
  const password = passwordEl?.value || '';
  if (!email || !password) {
    setLoginMsg('Please enter email and password.', 'error');
    return;
  }

  const { error } = await supabaseLogin.auth.signInWithPassword({ email, password });
  if (error) {
    setLoginMsg(error.message, 'error');
    return;
  }
  setLoginMsg('Success! Redirecting...', 'success');
  window.location.href = './app.html';
});


