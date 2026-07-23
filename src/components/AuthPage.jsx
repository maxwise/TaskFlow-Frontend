import { useState } from 'react';
import Icon from './Icon';

const initialValues = { name: '', email: '', password: '' };

export default function AuthPage({ onAuthenticate }) {
  const [mode, setMode] = useState('login');
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setValues(initialValues);
  }

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onAuthenticate(mode, values);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand"><span>T</span><strong>TaskFlow</strong></div>
        <div className="auth-hero__copy">
          <p className="eyebrow">Plan with clarity</p>
          <h1>Turn every responsibility into visible progress.</h1>
          <p>Securely organize tasks, monitor deadlines, and keep your priorities available wherever you work.</p>
        </div>
        <div className="auth-feature"><Icon name="check" /><span>Private task lists protected by JWT authentication</span></div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome to TaskFlow</p>
          <h2>{mode === 'login' ? 'Sign in to your workspace' : 'Create your account'}</h2>
          <p className="auth-card__intro">
            {mode === 'login' ? 'Enter your account details to continue.' : 'Register to begin organizing your work.'}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Authentication options">
            <button className={mode === 'login' ? 'is-active' : ''} type="button" onClick={() => changeMode('login')}>Log in</button>
            <button className={mode === 'register' ? 'is-active' : ''} type="button" onClick={() => changeMode('register')}>Register</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="form-field form-field--full">
                <span>Full name</span>
                <input name="name" type="text" minLength="2" maxLength="60" required value={values.name} onChange={handleChange} placeholder="Your full name" />
              </label>
            )}
            <label className="form-field form-field--full">
              <span>Email address</span>
              <input name="email" type="email" maxLength="120" required value={values.email} onChange={handleChange} placeholder="name@example.com" />
            </label>
            <label className="form-field form-field--full">
              <span>Password</span>
              <input name="password" type="password" minLength="8" required value={values.password} onChange={handleChange} placeholder="At least 8 characters" />
            </label>
            {error && <p className="form-error auth-error" role="alert">{error}</p>}
            <button className="button button--primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              {!submitting && <Icon name="arrow" size={18} />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
