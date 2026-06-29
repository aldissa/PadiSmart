const BASE_URL = 'http://127.0.0.1:8000'

function getToken() {
  return localStorage.getItem('access_token')
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

function authHeader() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  }
}

function saveTokens(access, refresh) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

function isLoggedIn() {
  return !!getToken()
}

async function logout() {
  const refresh = getRefreshToken()
  try {
    await fetch(`${BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ refresh })
    })
  } catch (e) {}
  clearTokens()
  window.location.href = '/frontend/auth/login.html'
}