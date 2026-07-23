import Icon from './Icon';

const navigationItems = [
  { id: 'all', label: 'All tasks', icon: 'grid' },
  { id: 'today', label: 'Today', icon: 'today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'upcoming' },
  { id: 'completed', label: 'Completed', icon: 'check' },
];

export default function Sidebar({ activeView, onChangeView, isOpen, onClose, counts }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={`sidebar-backdrop ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand__mark">T</div>
          <div>
            <strong>TaskFlow</strong>
            <span>Plan with clarity</span>
          </div>
          <button
            className="icon-button sidebar__close mobile-only"
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Task views">
          <p className="sidebar__label">Overview</p>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'is-active' : ''}`}
              type="button"
              onClick={() => {
                onChangeView(item.id);
                onClose();
              }}
            >
              <span className="nav-item__main">
                <Icon name={item.icon} size={19} />
                {item.label}
              </span>
              <span className="nav-item__count">{counts[item.id] ?? 0}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar__tip">
          <span className="sidebar__tip-icon"><Icon name="alert" size={19} /></span>
          <strong>Stay focused</strong>
          <p>Complete one important task before starting another.</p>
        </div>
      </aside>
    </>
  );
}
