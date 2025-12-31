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
