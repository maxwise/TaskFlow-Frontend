import Icon from './Icon';

const statConfig = [
  { key: 'total', label: 'Total tasks', icon: 'grid', accent: 'violet' },
  { key: 'pending', label: 'Pending', icon: 'upcoming', accent: 'amber' },
  { key: 'completed', label: 'Completed', icon: 'check', accent: 'green' },
  { key: 'overdue', label: 'Overdue', icon: 'alert', accent: 'red' },
];

export default function DashboardStats({ stats }) {
  return (
    <section className="stats-grid" aria-label="Task statistics">
      {statConfig.map((stat) => (
        <article className="stat-card" key={stat.key}>
          <span className={`stat-card__icon stat-card__icon--${stat.accent}`}>
            <Icon name={stat.icon} />
          </span>
          <div>
            <p>{stat.label}</p>
            <strong>{stats[stat.key]}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}
