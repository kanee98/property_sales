export function normalizeImageUrl(src: string): string {
  const value = (src || "").trim();
  if (!value) return "/img/default.jpg";

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("/api/images/")) {
    return value;
  }

  const knownStatic = new Set([
    "default.jpg",
    "kandy1.jpg",
    "property1.jpg",
    "Propwise Logo No BG.png",
    "PropwiseLogo.jpg",
    "Propwise Logo No BG - Full.png",
  ]);

  if (value.startsWith("/img/")) {
    const fileName = decodeURIComponent(value.split("/").pop() || "");
    if (knownStatic.has(fileName)) {
      return value;
    }
    return `/api/images/${encodeURIComponent(fileName)}`;
  }

  const fileName = value.replace(/^\/+/, "");
  return `/api/images/${encodeURIComponent(fileName)}`;
}
