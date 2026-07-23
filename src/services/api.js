const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function normalizeTask(task) {
  return {
    ...task,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  };
}

async function request(path, options = {}) {
  const token = localStorage.getItem('taskflow.token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'The request could not be completed.');
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  register(values) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(values) });
  },
  login(values) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(values) });
  },
  me() {
    return request('/auth/me');
  },
  async listTasks() {
    const data = await request('/tasks');
    return data.tasks.map(normalizeTask);
  },
  async createTask(values) {
    const data = await request('/tasks', { method: 'POST', body: JSON.stringify(values) });
    return normalizeTask(data.task);
  },
  async updateTask(id, values) {
    const data = await request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(values) });
    return normalizeTask(data.task);
  },
  async updateTaskStatus(id, status) {
    const data = await request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return normalizeTask(data.task);
  },
  deleteTask(id) {
    return request(`/tasks/${id}`, { method: 'DELETE' });
  },
};
