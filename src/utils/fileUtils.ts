// src/utils/fileUtils.ts

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function downloadFile(
  source: Blob | string,
  filename = "download"
): void {
  const isBlob = source instanceof Blob;
  const url = isBlob ? URL.createObjectURL(source) : source;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (isBlob) {
    URL.revokeObjectURL(url);
  }
}

export function base64ToBlob(base64: string, mime = "application/octet-stream") {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);

  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const hs = String(date.getHours()).padStart(2, '0');
  const ms = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${d}-${m}-${y} ${hs}:${ms}:${ss}`;
}

export function getDocumentEffectiveStatus(
  {
    effective_start_date,
    effective_end_date,
  }: {
    effective_start_date?: string;
    effective_end_date?: string;
  },
  now: Date = new Date(),
): "Sắp có hiệu lực" | "Còn hiệu lực" | "Hết hiệu lực" {
  const start = effective_start_date ? new Date(effective_start_date) : null;
  const end = effective_end_date ? new Date(effective_end_date) : null;

  if (start && now < start) {
    return "Sắp có hiệu lực";
  }
  if (end && now > end) {
    return "Hết hiệu lực";
  }
  return "Còn hiệu lực";
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
