import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const icons = { error: AlertCircle, success: CheckCircle2, info: Info };
export default function Alert({ type = 'info', children }) {
  const Icon = icons[type] || Info;
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}><Icon size={17} /><span>{children}</span></div>;
}
