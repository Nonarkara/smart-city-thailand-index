const UTF8_BOM = "\uFEFF";

export function downloadCsv(filename: string, csvText: string) {
  const blob = new Blob([UTF8_BOM, csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
