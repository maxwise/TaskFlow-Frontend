import { useEffect, useMemo, useState } from 'react';
import AuthPage from './components/AuthPage';
import ConfirmDialog from './components/ConfirmDialog';
import DashboardStats from './components/DashboardStats';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskToolbar from './components/TaskToolbar';
import Toast from './components/Toast';
import { api } from './services/api';
import { clearSession, loadSession, saveSession } from './utils/authStorage';
import { loadTheme, saveTheme } from './utils/storage';

const initialFilters = {
  search: '',
  priority: 'All',
  sort: 'due-asc',
};

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getPriorityWeight(priority) {
  return { High: 3, Medium: 2, Low: 1 }[priority] || 0;
}

export default function App() {
  const initialSession = loadSession();
  const [user, setUser] = useState(initialSession.user);
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(loadTheme);
  const [activeView, setActiveView] = useState('all');
  const [filters, setFilters] = useState(initialFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(Boolean(initialSession.token));
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const { token } = loadSession();
    if (!token) {
      setLoading(false);
      return;
    }

    async function restoreSession() {
      try {
        const [profileData, remoteTasks] = await Promise.all([api.me(), api.listTasks()]);
        setUser(profileData.user);
        setTasks(remoteTasks);
        saveSession({ token, user: profileData.user });
      } catch (error) {
        clearSession();
        setUser(null);
        setTasks([]);
        setPageError(error.status === 401 ? '' : error.message);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const stats = useMemo(() => {
    const today = getTodayString();
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === 'Pending').length,
      completed: tasks.filter((task) => task.status === 'Completed').length,
      overdue: tasks.filter(
        (task) => task.status !== 'Completed' && task.dueDate && task.dueDate < today,
      ).length,
    };
  }, [tasks]);

  const counts = useMemo(() => {
    const today = getTodayString();
    return {
      all: tasks.length,
      today: tasks.filter((task) => task.dueDate === today).length,
      upcoming: tasks.filter(
        (task) => task.status !== 'Completed' && task.dueDate && task.dueDate > today,
      ).length,
      completed: tasks.filter((task) => task.status === 'Completed').length,
    };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    const today = getTodayString();
    const normalizedSearch = filters.search.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        if (activeView === 'today') return task.dueDate === today;
        if (activeView === 'upcoming') {
          return task.status !== 'Completed' && task.dueDate && task.dueDate > today;
        }
        if (activeView === 'completed') return task.status === 'Completed';
        return true;
      })
      .filter((task) => filters.priority === 'All' || task.priority === filters.priority)
      .filter((task) => {
        if (!normalizedSearch) return true;
        return [task.title, task.description, task.category]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (filters.sort === 'priority') {
          return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
        }
        if (filters.sort === 'created') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        const aDate = a.dueDate || '9999-12-31';
        const bDate = b.dueDate || '9999-12-31';
        return filters.sort === 'due-desc'
          ? bDate.localeCompare(aDate)
          : aDate.localeCompare(bDate);
      });
  }, [activeView, filters, tasks]);

  function showToast(message) {
    setToast('');
    window.setTimeout(() => setToast(message), 20);
  }

  async function authenticate(mode, values) {
    const data = mode === 'register'
      ? await api.register(values)
      : await api.login({ email: values.email, password: values.password });
    saveSession(data);
    setUser(data.user);
    setTasks(await api.listTasks());
    setPageError('');
  }

  function logout() {
    clearSession();
    setUser(null);
    setTasks([]);
    setActiveView('all');
    setFilters(initialFilters);
  }

  function handleApiError(error) {
    if (error.status === 401) {
      logout();
      return;
    }
    setPageError(error.message);
  }

  function openCreateForm() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingTask(null);
  }

  async function handleTaskSubmit(values) {
    setSaving(true);
    setPageError('');
    try {
      if (editingTask) {
        const updatedTask = await api.updateTask(editingTask.id, values);
        setTasks((current) => current.map((task) => (
          task.id === updatedTask.id ? updatedTask : task
        )));
        showToast('Task updated successfully.');
      } else {
        const newTask = await api.createTask(values);
        setTasks((current) => [newTask, ...current]);
        showToast('New task created.');
      }
      setFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(taskId) {
    const currentTask = tasks.find((task) => task.id === taskId);
    if (!currentTask) return;
    const status = currentTask.status === 'Completed' ? 'Pending' : 'Completed';
    setPageError('');
    try {
      const updatedTask = await api.updateTaskStatus(taskId, status);
      setTasks((current) => current.map((task) => (
        task.id === taskId ? updatedTask : task
      )));
      showToast(status === 'Completed' ? 'Task marked as completed.' : 'Task returned to pending.');
    } catch (error) {
      handleApiError(error);
    }
  }

  async function deleteTask() {
    if (!taskToDelete) return;
    setPageError('');
    try {
      await api.deleteTask(taskToDelete.id);
      setTasks((current) => current.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      showToast('Task deleted.');
    } catch (error) {
      handleApiError(error);
    }
  }

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  if (loading) {
    return <main className="loading-screen"><div className="loading-spinner" /><p>Loading your TaskFlow workspace…</p></main>;
  }

  if (!user) {
    return <AuthPage onAuthenticate={authenticate} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        counts={counts}
      />

      <div className="app-main">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          onOpenSidebar={() => setSidebarOpen(true)}
          onAddTask={openCreateForm}
          user={user}
          onLogout={logout}
        />

        <main className="content">
          {pageError && (
            <div className="page-error" role="alert">
              <span>{pageError}</span>
              <button type="button" onClick={() => setPageError('')}>Dismiss</button>
            </div>
          )}

          <section className="welcome-panel">
            <div>
              <p className="eyebrow">Good progress, {user.name.split(' ')[0]}</p>
              <h2>Organize today. Achieve more tomorrow.</h2>
              <p>Focus on your most important work and keep every deadline visible.</p>
            </div>
            <button className="button button--light" type="button" onClick={openCreateForm}>
              <IconPlus />
              Create task
            </button>
          </section>

          <DashboardStats stats={stats} />
          <TaskToolbar filters={filters} onChange={updateFilter} resultCount={visibleTasks.length} />
          <TaskList
            tasks={visibleTasks}
            onToggle={toggleTask}
            onEdit={openEditForm}
            onDelete={setTaskToDelete}
            onAddTask={openCreateForm}
          />
        </main>
      </div>

      <button className="floating-add mobile-only" type="button" onClick={openCreateForm} aria-label="Add a task">
        <IconPlus />
      </button>

      <TaskForm
        isOpen={formOpen}
        task={editingTask}
        onClose={closeForm}
        onSubmit={handleTaskSubmit}
        isSubmitting={saving}
      />
      <ConfirmDialog task={taskToDelete} onCancel={() => setTaskToDelete(null)} onConfirm={deleteTask} />
      <Toast message={toast} />
    </div>
  );
}

function IconPlus() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
