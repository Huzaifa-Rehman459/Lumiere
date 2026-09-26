import PageHeader from "../PageHeader/PageHeader";
import "./PageContent.css";
export default function PageContent({ title, description, children }) {
  return (
    <section className="page-content">
      <PageHeader title={title} description={description} />
      {children}
    </section>
  );
}
