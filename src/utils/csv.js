export function createCsv(headers, rows) {
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')}`;
}

export function downloadCsv(filename, headers, rows) {
  const url = URL.createObjectURL(
    new Blob([createCsv(headers, rows)], { type: 'text/csv;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
