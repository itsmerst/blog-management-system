// Simple API wrapper with silent refresh token support

export async function apiFetch(path, options = {}) {
  const baseUrl = 'http://localhost:8080';
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  const headers = options.headers ? {...options.headers} : {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  const doFetch = () => fetch(baseUrl + path, {...options, headers});

  let res = await doFetch();
  if (res.status === 401 && refreshToken) {
    // try refresh
    const refreshRes = await fetch(baseUrl + '/api/auth/refresh', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({refreshToken})
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('token', data.token);
      headers['Authorization'] = 'Bearer ' + data.token;
      res = await doFetch();
    } else {
      // refresh failed, clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw new Error('Session expired');
    }
  }
  return res;
}
