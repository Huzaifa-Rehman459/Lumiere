import { useAdmin } from "../../context/AdminContext";
import PageContent from "../../components/PageContent/PageContent";
import Panel from "../../components/Panel/Panel";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import { filterRows } from "../../utils/adminHelpers";
import { useState } from "react";
import "./Reviews.css";
export default function Reviews() {
  const { data, updateCollection, notify } = useAdmin();
  const [query, setQuery] = useState("");
  const reviews = filterRows(data.reviews, query);
  function remove(id) {
    if (confirm("Delete this review?")) {
      updateCollection(
        "reviews",
        data.reviews.filter((r) => r.id !== id),
      );
      notify("Review deleted");
    }
  }
  return (
    <PageContent
      title="Reviews"
      description="Moderate customer feedback displayed on your store."
    >
      <Panel>
        <div className="list-search">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reviews..."
          />
        </div>
        {reviews.map((r) => (
          <article className="review-card" key={r.id}>
            <div>
              <b>{r.customer}</b>{" "}
              <span className="review-stars">{"★".repeat(r.rating)}</span>{" "}
              <StatusBadge status={r.status} />
            </div>
            <p>
              <b>{r.product}</b> · {r.text}
            </p>
            <button
              className="btn btn-light"
              onClick={() => {
                updateCollection(
                  "reviews",
                  data.reviews.map((x) =>
                    x.id === r.id
                      ? {
                          ...x,
                          status:
                            x.status === "Published" ? "Hidden" : "Published",
                        }
                      : x,
                  ),
                );
                notify("Review status updated");
              }}
            >
              {r.status === "Published" ? "Hide" : "Publish"}
            </button>{" "}
            <button className="btn btn-light" onClick={() => remove(r.id)}>
              Delete
            </button>
          </article>
        ))}
      </Panel>
    </PageContent>
  );
}
