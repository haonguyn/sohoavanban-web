// src/utils/textUtils.ts

export function truncate(text: string, length = 100): string {
  return text.length <= length ? text : text.slice(0, length) + "...";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
