export const money = (value) => "$" + Number(value || 0).toFixed(2);
export const filterRows = (items, query) =>
  items.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase()),
  );
export function downloadCSV(name, items) {
  const rows = items || [];
  if (!rows.length) return;
  const csv = [
    Object.keys(rows[0]).join(","),
    ...rows.map((row) =>
      Object.values(row)
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `lumiere-${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
export const makeId = () => Date.now();
