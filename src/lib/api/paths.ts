export function toApiPathSegment(value: string | number): string {
  const segment = String(value);

  if (!segment || segment === "." || segment === "..") {
    throw new TypeError("Invalid API path segment");
  }

  return encodeURIComponent(segment);
}
