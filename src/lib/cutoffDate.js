// src/lib/cutoffDate.js
export function getCutoffDate() {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
  const dateOnly = cutoffDate.toISOString().split("T")[0];
  return `${dateOnly}T00:00:00Z`;
}
