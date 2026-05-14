// src/utils/fileUtils.ts

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function downloadFile(
  source: Blob | string | null | undefined,
  filename = "download"
): void {
  if (!source) {
    console.error("downloadFile: No source provided");
    return;
  }

  const isBlob = source instanceof Blob;
  const url = isBlob ? URL.createObjectURL(source) : source;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  
  // For cross-origin URLs, a.download might not work. 
  // In that case, we suggest opening in a new tab as fallback.
  if (!isBlob && typeof source === 'string' && source.startsWith('http')) {
    a.target = "_blank";
  }

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  if (isBlob) {
    URL.revokeObjectURL(url);
  }
}

export function base64ToBlob(base64: string | null | undefined, mime = "application/octet-stream") {
  if (!base64) {
    console.error("base64ToBlob: No base64 data provided");
    return new Blob([], { type: mime });
  }
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

export function getDocumentEffectiveStatus(
  doc: {
    effective_start_date?: string;
    effective_end_date?: string;
    status?: string;
  },
  now: Date = new Date(),
): string {
  // 1. Ưu tiên các trạng thái đặc biệt được đánh dấu từ Database
  const dbStatus = doc.status?.trim();
  
  if (dbStatus === "Hết hiệu lực một phần") {
    return "Hết hiệu lực một phần";
  }
  
  if (dbStatus === "Hết hiệu lực" || dbStatus === "Bị bãi bỏ" || dbStatus === "Bị thay thế") {
    return "Hết hiệu lực";
  }

  // 2. Nếu không có trạng thái đặc biệt, tính toán dựa trên ngày tháng
  const start = doc.effective_start_date ? new Date(doc.effective_start_date) : null;
  const end = doc.effective_end_date ? new Date(doc.effective_end_date) : null;

  // Xử lý ngày hiệu lực (bỏ qua giờ phút giây để so sánh chính xác theo ngày)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (start) {
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    if (today < startDate) {
      return "Sắp có hiệu lực";
    }
  }

  if (end) {
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    if (today > endDate) {
      return "Hết hiệu lực";
    }
  }

  return "Còn hiệu lực";
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
