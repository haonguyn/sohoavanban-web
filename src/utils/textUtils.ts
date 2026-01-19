// src/utils/textUtils.ts

export function truncate(text: string, length = 100): string {
  return text.length <= length ? text : text.slice(0, length) + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function normalizeDocType(text: string): string {
  if (!text) return "";
  text = text.normalize("NFC");
  text = text.toLowerCase();
  text = text.replace(/\s+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getStatusClass(status: string): string {
  switch (status) {
    case "Còn hiệu lực":
      return "bg-green-100 text-green-700 border-green-200";
    case "Sắp có hiệu lực":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Hết hiệu lực một phần":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Hết hiệu lực":
      return "bg-gray-100 text-gray-500 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
