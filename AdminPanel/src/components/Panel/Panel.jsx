export default function Panel({ title, className = "", children }) {
  return (
    <section className={`panel ${className}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </section>
  );
}