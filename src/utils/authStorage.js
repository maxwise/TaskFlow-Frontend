const TOKEN_KEY = 'taskflow.token';
const USER_KEY = 'taskflow.user';

export function loadSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    return { token, user: rawUser ? JSON.parse(rawUser) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
