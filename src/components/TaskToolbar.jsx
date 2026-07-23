import Icon from './Icon';

export default function TaskToolbar({ filters, onChange, resultCount }) {
  return (
    <section className="task-toolbar">
      <div className="task-toolbar__heading">
        <div>
          <p className="eyebrow">Task board</p>
          <h2>{resultCount} {resultCount === 1 ? 'task' : 'tasks'}</h2>
        </div>
      </div>

      <div className="task-toolbar__controls">
        <label className="search-field">
          <span className="sr-only">Search tasks</span>
          <Icon name="search" size={19} />
          <input
            type="search"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(event) => onChange('search', event.target.value)}
          />
        </label>

        <label className="select-field">
          <span className="sr-only">Filter by priority</span>
          <select
            value={filters.priority}
            onChange={(event) => onChange('priority', event.target.value)}
          >
            <option value="All">All priorities</option>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>
        </label>

        <label className="select-field">
          <span className="sr-only">Sort tasks</span>
          <select value={filters.sort} onChange={(event) => onChange('sort', event.target.value)}>
            <option value="due-asc">Due date: earliest</option>
            <option value="due-desc">Due date: latest</option>
            <option value="priority">Priority</option>
            <option value="created">Recently created</option>
          </select>
        </label>
      </div>
    </section>
  );
}
