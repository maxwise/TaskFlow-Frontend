import Icon from './Icon';
import TaskCard from './TaskCard';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, onAddTask }) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state">
        <span className="empty-state__icon"><Icon name="inbox" size={28} /></span>
        <h3>No matching tasks</h3>
        <p>Change the filters or create a new task to keep your work moving.</p>
        <button className="button button--primary" type="button" onClick={onAddTask}>
          <Icon name="plus" size={18} />
          Add a task
        </button>
      </section>
    );
  }

  return (
    <section className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
