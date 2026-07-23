import { useEffect, useState } from 'react';
import Icon from './Icon';

const initialValues = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
  category: 'Personal',
  status: 'Pending',
};

export default function TaskForm({ isOpen, task, onClose, onSubmit, isSubmitting = false }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValues(task ? { ...initialValues, ...task } : initialValues);
      setError('');
    }
  }, [isOpen, task]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim() || 'Personal',
    });
  }

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <header className="modal__header">
          <div>
            <p className="eyebrow">Task details</p>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create a new task'}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close form" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <label className="form-field form-field--full">
            <span>Task title</span>
            <input
              autoFocus
              name="title"
              type="text"
              maxLength="80"
              placeholder="What needs to be done?"
              value={values.title}
              onChange={handleChange}
            />
          </label>

          <label className="form-field form-field--full">
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              maxLength="300"
              placeholder="Add helpful details about this task..."
              value={values.description}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span>Due date</span>
            <input name="dueDate" type="date" value={values.dueDate} onChange={handleChange} />
          </label>

          <label className="form-field">
            <span>Priority</span>
            <select name="priority" value={values.priority} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          <label className="form-field">
            <span>Category</span>
            <input
              name="category"
              type="text"
              maxLength="30"
              placeholder="Personal"
              value={values.category}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span>Status</span>
            <select name="status" value={values.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <footer className="modal__footer">
            <button className="button button--secondary" type="button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button className="button button--primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : task ? 'Save changes' : 'Create task'}
              {!isSubmitting && <Icon name="arrow" size={18} />}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
