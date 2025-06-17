export const formatDate = (dateStr: string) => {
    if (typeof dateStr !== "string") return ""
    if (dateStr.length === 6) {
        // YYYYMM format
        const year = dateStr.slice(0, 4)
        const month = dateStr.slice(4, 6)
        return `${month}/${year}`
    } else if (dateStr.length === 8) {
        // YYYYMMDD format
        const year = dateStr.slice(0, 4)
        const month = dateStr.slice(4, 6)
        const day = dateStr.slice(6, 8)
        return `${day}/${month}/${year}`
    }
    return dateStr
}