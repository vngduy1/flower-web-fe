const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(value: string): Date | null {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string): string {
  const date = toDate(value.includes("T") ? value : `${value}T00:00:00+09:00`);

  return date ? dateFormatter.format(date) : value;
}

export function formatDateTime(value: string): string {
  const date = toDate(value);

  return date ? dateTimeFormatter.format(date) : value;
}
