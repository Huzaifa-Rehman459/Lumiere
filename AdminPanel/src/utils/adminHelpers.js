export const money = (value) => "$" + Number(value || 0).toFixed(2);

const safeCell = (value) => {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
};

export function downloadCSV(name, items) {
  const rows = items || [];
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => safeCell(row[h])).join(",")),
  ].join("\n");

  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `lumiere-${name}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}