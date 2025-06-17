export const formatCurrency = (value: string | number): string => {
    if (typeof value !== "string" && typeof value !== "number") return ""
    // Convert to string for sign check
    const strValue = String(value)
    const isNegative = strValue.trim().startsWith("-")
    // Remove any commas and sign for parsing
    const numeric = Number(strValue.replace(/,/g, ""))
    if (isNaN(numeric)) return String(value)
    // Format as NIS (₪)
    return (
        (isNegative ? "-" : "") +
        new Intl.NumberFormat("he-IL", {
            style: "currency",
            currency: "ILS",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(Math.abs(numeric))
    )
}