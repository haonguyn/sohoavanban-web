// src/utils/textUtils.ts

export function truncate(text: string, length = 100) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
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

export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function formatLinkType(type: string): string {
  if (!type) return "";

  const parts = type.split("(");
  const rawPart = parts[0] || "";
  const raw = rawPart.trim().toLowerCase();
  const isIncoming = type.includes("(Nhận)") || type.includes("(TOI)");

  const mapping: Record<string, string> = {
    can_cu: isIncoming ? "Là căn cứ của" : "Căn cứ vào",
    thay_the: isIncoming ? "Được thay thế bởi" : "Thay thế cho",
    thay_the_toan_phan: isIncoming ? "Bị thay thế toàn bộ bởi" : "Thay thế toàn bộ cho",
    thay_the_1_phan: isIncoming ? "Bị thay thế một phần bởi" : "Thay thế một phần cho",
    bi_thay_the: isIncoming ? "Thay thế cho" : "Bị thay thế bởi",
    sua_doi: isIncoming ? "Được sửa đổi bởi" : "Sửa đổi, bổ sung cho",
    sua_doi_bo_sung: isIncoming ? "Được sửa đổi bởi" : "Sửa đổi, bổ sung cho",
    bi_sua_doi: isIncoming ? "Sửa đổi cho" : "Bị sửa đổi bởi",
    het_hieu_luc: isIncoming ? "Bị bãi bỏ bởi" : "Làm hết hiệu lực văn bản",
    het_hieu_luc_1_phan: isIncoming ? "Bị bãi bỏ một phần bởi" : "Làm hết hiệu lực một phần của",
    het_hieu_luc_toan_bo: isIncoming ? "Bị bãi bỏ toàn bộ bởi" : "Làm hết hiệu lực toàn bộ của",
    dinh_chinh: isIncoming ? "Được đính chính bởi" : "Đính chính cho",
    huong_dan: isIncoming ? "Được hướng dẫn bởi" : "Hướng dẫn thi hành cho",
    bi_dinh_chinh: isIncoming ? "Đính chính cho" : "Bị đính chính bởi",
  };

  return mapping[raw] || type;
}

export function formatAiText(text: string): string {
  if (!text) return "";
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/\n\s*-\s/g, "<br/>• ");
  html = html.replace(/\n/g, "<br/>");
  return html;
}
