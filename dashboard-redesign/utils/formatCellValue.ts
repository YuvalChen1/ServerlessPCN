// Helper function for formatting
export function formatCellValue(value: any, key: string) {
  const normalizedKey = key.replace(/_/g, "").toLowerCase();

  // Don't format for vatFileNumber or companyId
  if (["vatfilenumber", "companyid", "referencenumber"].includes(normalizedKey)) {
    return value;
  }

  // Special handling for reportDate: format as mm/yyyy if value is YYYYMM
  if (normalizedKey === "reportdate" && typeof value === "string" && /^\d{6}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    return `${month}/${year}`;
  }

  // Format dates (if key contains "date")
  if (normalizedKey.includes("date")) {
    // Handle YYYYMMDD or +YYYYMM-DD or similar
    let raw = String(value).replace(/^\+/, ""); // Remove leading +
    let match = raw.match(/^(\d{4})(\d{2})(\d{2})$/); // YYYYMMDD
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
    // Handle YYYYMM-DD (e.g. 202501-12)
    match = raw.match(/^(\d{4})(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
    // Try to parse as ISO or Date
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    }
    return value;
  }

  // Format numbers with optional +/-
  if (typeof value === "string" && /^[+-]?\d+$/.test(value)) {
    const sign = value.startsWith("-") ? "-" : value.startsWith("+") ? "" : "";
    const num = parseInt(value, 10);
    return (sign + Math.abs(num).toLocaleString());
  }
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return value;
}