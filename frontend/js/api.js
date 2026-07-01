const BASE_URL = 'https://padismart-production.up.railway.app/'

function getToken() { return localStorage.getItem('access_token') }
function getRefreshToken() { return localStorage.getItem('refresh_token') }
function authHeader() {
  return { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' }
}
function saveTokens(access, refresh) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}
function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}
function isLoggedIn() { return !!getToken() }