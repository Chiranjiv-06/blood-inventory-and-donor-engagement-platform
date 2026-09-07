/**
 * Generic utility to export structured data rows as a downloadable CSV file.
 * Handles proper escaping of commas, double-quotes, newlines, and adds UTF-8 BOM.
 */

export interface CsvColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number | boolean | null | undefined);
}

export function exportToCsv<T>(
  filename: string,
  data: T[],
  columns: CsvColumn<T>[]
): void {
  if (!data || data.length === 0) {
    return;
  }

  // Generate headers
  const headerRow = columns.map((col) => escapeCsvValue(col.header)).join(',');

  // Generate data rows
  const rows = data.map((row) =>
    columns
      .map((col) => {
        let value: any;
        if (typeof col.accessor === 'function') {
          value = col.accessor(row);
        } else {
          value = row[col.accessor];
        }
        return escapeCsvValue(value);
      })
      .join(',')
  );

  const csvContent = [headerRow, ...rows].join('\r\n');
  // Prepend UTF-8 BOM so Excel and other spreadsheet apps render accented/special characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);

  const sanitizedFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.setAttribute('download', sanitizedFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value).trim();
  // Escape double quotes by doubling them, wrap in quotes
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};
