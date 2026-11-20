import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MailCheck } from 'lucide-react';
import FormField from '../components/FormField.jsx';
import Alert from '../components/Alert.jsx';
import { requestPasswordReset } from '../services/authService.js';
import { isValidEmail } from '../utils/validation.js';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return; }
    setError(''); setLoading(true);
    try { await requestPasswordReset(email); setSubmitted(true); }
    catch { setError('We could not process that request. Please try again.'); }
    finally { setLoading(false); }
  }
  return <section className="form-panel">
    <Link to="/login" className="back-link"><ArrowLeft size={16} /> Back to sign in</Link>
    {!submitted ? <>
      <div className="form-heading recovery-heading"><span className="icon-orb"><MailCheck size={22} /></span><span className="form-kicker">ACCOUNT RECOVERY</span><h2>Forgot your password?</h2><p>No worries. Enter the email address linked to your account and we'll show you the next step.</p></div>
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit} noValidate className="form-stack">
        <FormField label="Email address" name="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="you@example.com" autoComplete="email" error={error} required />
        <button className="primary-button" type="submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Checking…</> : <>Continue <ArrowRight size={17} /></>}</button>
      </form>
    </> : <div className="success-state"><span className="success-orb"><MailCheck size={27} /></span><span className="form-kicker">REQUEST RECEIVED</span><h2>Check your inbox<span className="heading-period">.</span></h2><p>If an account exists for <strong>{email}</strong>, password reset instructions would be sent. This frontend demo does not send email.</p><Alert type="success">Your request was recorded in this browser's demo state.</Alert><Link to="/login" className="primary-button button-link">Return to sign in <ArrowRight size={17} /></Link></div>}
  </section>;
}
