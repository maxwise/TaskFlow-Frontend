import Icon from './Icon';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span><Icon name="check" size={16} /></span>
      {message}
    </div>
  );
}
