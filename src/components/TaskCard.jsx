import Icon from './Icon';

function formatDate(dateString) {
  if (!dateString) return 'No due date';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`));
}

function isOverdue(task) {
  if (!task.dueDate || task.status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.dueDate}T00:00:00`) < today;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <article className={`task-card ${task.status === 'Completed' ? 'is-complete' : ''}`}>
      <button
        type="button"
        className="task-card__check"
        aria-label={task.status === 'Completed' ? 'Mark task as pending' : 'Mark task as completed'}
        onClick={() => onToggle(task.id)}
      >
        {task.status === 'Completed' && <Icon name="check" size={15} />}
      </button>

      <div className="task-card__content">
        <div className="task-card__topline">
          <span className={`priority-badge priority-badge--${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span className="category-badge">{task.category}</span>
        </div>
        <h3>{task.title}</h3>
        <p>{task.description || 'No description was added for this task.'}</p>
        <div className="task-card__meta">
          <span className={overdue ? 'is-overdue' : ''}>
            <Icon name="calendar" size={16} />
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
          <span className={`status-badge status-badge--${task.status.toLowerCase()}`}>
            {task.status}
          </span>
        </div>
      </div>

      <div className="task-card__actions">
        <button className="icon-button icon-button--small" type="button" aria-label="Edit task" onClick={() => onEdit(task)}>
          <Icon name="edit" size={17} />
        </button>
        <button className="icon-button icon-button--small icon-button--danger" type="button" aria-label="Delete task" onClick={() => onDelete(task)}>
          <Icon name="trash" size={17} />
        </button>
      </div>
    </article>
  );
}
