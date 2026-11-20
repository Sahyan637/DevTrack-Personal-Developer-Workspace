export default function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`dash-card ${className}`}>
      <div className="dash-card-heading">
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {action}
      </div>
      {children}
    </section>
  );
}
