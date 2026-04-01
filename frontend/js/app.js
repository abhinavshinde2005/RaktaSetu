// ─── Auth ────────────────────────────────────────────────────────────────────

const checkAuth = async () => {
  try {
    console.log('🔍 [checkAuth] Calling:', API_URL + '/api/check-auth');
    const res = await fetch(API_URL + '/api/check-auth', { credentials: 'include' });
    const data = await res.json();
    console.log('🔍 [checkAuth] Result:', data);
    return data.authenticated;
  } catch (err) {
    console.error('❌ [checkAuth] Fetch failed:', err.message);
    return false;
  }
};

const requireAuth = async () => {
  console.log('🔒 [requireAuth] Checking on page:', window.location.href);
  const isAuth = await checkAuth();
  if (!isAuth) {
    console.warn('⚠️ [requireAuth] Not authenticated → redirecting to login.html');
    window.location.replace('login.html');
  } else {
    console.log('✅ [requireAuth] Authenticated, staying on page');
  }
};

const logout = async () => {
  console.log('🚪 [logout] Sending logout request...');
  await fetch(API_URL + '/api/logout', { method: 'POST', credentials: 'include' });
  console.log('✅ [logout] Done, redirecting to login');
  window.location.href = 'login.html';
};

// ─── Toast ───────────────────────────────────────────────────────────────────

const showToast = (message, type = 'success') => {
  console.log(`🔔 [toast] ${type}: ${message}`);
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// ─── Date Helpers ─────────────────────────────────────────────────────────────

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
