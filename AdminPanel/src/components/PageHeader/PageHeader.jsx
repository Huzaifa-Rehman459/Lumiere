import "./PageHeader.css";
export default function PageHeader({ title, description }) {
  return (
    <div className="page-heading">
      <div>
        <small className="page-eyebrow">LUMIÈRE / {title.toUpperCase()}</small>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <span className="page-date">
        {new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
      </span>
    </div>
  );
}
