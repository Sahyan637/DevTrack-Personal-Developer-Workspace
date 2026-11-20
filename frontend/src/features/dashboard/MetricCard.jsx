import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({ label, value, helper, icon: Icon, tone = 'mint' }) {
  return (
    <article className="metric-card">
      <div className="metric-topline">
        <span className={`metric-icon metric-${tone}`}><Icon size={18} /></span>
        <span className="metric-trend"><ArrowUpRight size={13} /> This month</span>
      </div>
      <p className="metric-label">{label}</p>
      <div className="metric-value-row"><strong>{value}</strong><span>{helper}</span></div>
    </article>
  );
}
