import { useEffect, useState } from 'react';
import { X, FolderPlus, ListPlus, Clock3, LoaderCircle } from 'lucide-react';

const actionConfig = {
  project: { title: 'Create a project', label: 'Project name', placeholder: 'e.g. Smart attendance system', icon: FolderPlus },
  task: { title: 'Add a task', label: 'Task title', placeholder: 'What needs to get done?', icon: ListPlus },
  learning: { title: 'Log learning time', label: 'Learning hours', placeholder: 'e.g. 1.5', icon: Clock3 },
};

export default function QuickActionModal({ type, onClose, onSave }) {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('1');
  const [note, setNote] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const config = actionConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (type !== 'learning' && !name.trim()) return setError('This field is required.');
    if (type === 'learning' && (!Number.isFinite(Number(hours)) || Number(hours) <= 0 || Number(hours) > 12)) return setError('Enter a value between 0.25 and 12 hours.');
    setSaving(true);
    try {
      await onSave(type, type === 'learning' ? { hours, note } : { name, dueDate });
      onClose();
    } catch (saveError) {
      setError(saveError.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-modal-title">
        <div className="quick-modal-heading"><span className="quick-modal-icon"><Icon size={19} /></span><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
        <h2 id="quick-modal-title">{config.title}</h2>
        <p className="quick-modal-copy">Add a little progress to your workspace.</p>
        <form onSubmit={handleSubmit} className="quick-modal-form">
          {type === 'learning' ? <>
            <label className="field-label" htmlFor="learning-hours">{config.label}</label>
            <input id="learning-hours" className="quick-input" type="number" min="0.25" max="12" step="0.25" value={hours} onChange={(event) => setHours(event.target.value)} autoFocus />
            <label className="field-label" htmlFor="learning-note">What did you study? <span className="optional-label">Optional</span></label>
            <input id="learning-note" className="quick-input" value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. React hooks" />
          </> : <>
            <label className="field-label" htmlFor="quick-name">{config.label}</label>
            <input id="quick-name" className="quick-input" value={name} onChange={(event) => setName(event.target.value)} placeholder={config.placeholder} maxLength={90} autoFocus />
            {type === 'task' && <><label className="field-label" htmlFor="quick-date">Due date <span className="optional-label">Optional</span></label><input id="quick-date" className="quick-input" type="date" min={new Date().toISOString().slice(0, 10)} value={dueDate} onChange={(event) => setDueDate(event.target.value ? new Date(`${event.target.value}T12:00:00`).toISOString() : '')} /></>}
          </>}
          {error && <p className="quick-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin-icon" size={16} /> Saving...</> : 'Save to workspace'}</button>
        </form>
      </section>
    </div>
  );
}
