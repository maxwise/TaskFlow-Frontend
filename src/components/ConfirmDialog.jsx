import Icon from './Icon';

export default function ConfirmDialog({ task, onCancel, onConfirm }) {
  if (!task) return null;

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <span className="confirm-dialog__icon"><Icon name="trash" size={24} /></span>
        <h2 id="delete-title">Delete this task?</h2>
        <p>“{task.title}” will be permanently removed from your task list.</p>
        <div className="confirm-dialog__actions">
          <button className="button button--secondary" type="button" onClick={onCancel}>Keep task</button>
          <button className="button button--danger" type="button" onClick={onConfirm}>Delete task</button>
        </div>
      </section>
    </div>
  );
}
