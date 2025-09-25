// Basic Supabase email/password signup
// Configure these with your own project values
const SUPABASE_URL = window.SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || '';

const messageEl = document.getElementById('message');

function setMessage(text, type = 'info') {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.style.color = type === 'error' ? '#ffb4b4' : type === 'success' ? '#b6ffb4' : '#cfd9da';
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  setMessage('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 'error');
}

const supabase = window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('Creating your account...');

    if (!supabase) {
      setMessage('Supabase not initialized. Check configuration.', 'error');
      return;
    }

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';

    if (!email || !password) {
      setMessage('Please enter email and password.', 'error');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/src/pages/login.html`
        }
      });

      if (error) {
        setMessage(error.message, 'error');
        return;
      }

      if (data?.user?.identities && data.user.identities.length === 0) {
        setMessage('This email is already registered. Try logging in.', 'error');
        return;
      }

      setMessage('Check your email for a confirmation link. Then log in.', 'success');
      form.reset();
      // Optional: if email confirmations are disabled in project, redirect directly
      // window.location.href = './app.html';
    } catch (err) {
      setMessage('Unexpected error. Please try again.', 'error');
      // Optionally log err
    }
  });
}


