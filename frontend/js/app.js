// Auth utilities
const checkAuth = async () => {
  try {
    const res = await fetch(API_URL + '/api/check-auth', { credentials: 'include' });
    const data = await res.json();
    return data.authenticated;
  } catch (err) {
    return false;
  }
};

const requireAuth = async () => {
  const isAuth = await checkAuth();
  if (!isAuth && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
    window.location.href = 'login.html';
  }
};

const logout = async () => {
  await fetch(API_URL + '/api/logout', { method: 'POST', credentials: 'include' });
  window.location.href = 'login.html';
};

// Show toast notification
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric' 
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
