import Icon from './Icon';

function initials(name = 'User') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Header({ theme, onToggleTheme, onOpenSidebar, onAddTask, user, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          className="icon-button mobile-only"
          type="button"
          aria-label="Open navigation"
          onClick={onOpenSidebar}
        >
          <Icon name="menu" />
        </button>
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>My Tasks</h1>
        </div>
      </div>

      <div className="topbar__actions">
        <button
          className="icon-button"
          type="button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          onClick={onToggleTheme}
        >
          <Icon name={theme === 'light' ? 'moon' : 'sun'} />
        </button>
        <button className="button button--primary topbar__add" type="button" onClick={onAddTask}>
          <Icon name="plus" size={18} />
          <span>Add task</span>
        </button>
        <div className="profile" aria-label="Signed in user">
          <div className="profile__avatar">{initials(user?.name)}</div>
          <div className="profile__copy desktop-only">
            <strong>{user?.name || 'TaskFlow user'}</strong>
            <span>{user?.email || 'Authenticated account'}</span>
          </div>
        </div>
        <button className="button button--secondary logout-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
