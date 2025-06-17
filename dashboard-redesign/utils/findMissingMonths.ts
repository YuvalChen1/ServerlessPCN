import { HeaderData } from "@/types/header-data";

export const findMissingMonths = (headers: HeaderData[]) => {
    if (headers.length <= 1) return [];

    const dates = headers.map(header => {
        const year = header.reportDate.slice(0, 4);
        const month = header.reportDate.slice(4, 6);
        return `${year}${month}`;
    }).sort();

    const missingMonths = [];
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    let currentDate = firstDate;
    while (currentDate <= lastDate) {
        if (!dates.includes(currentDate)) {
            missingMonths.push(currentDate);
        }
        // Move to next month
        const year = parseInt(currentDate.slice(0, 4));
        const month = parseInt(currentDate.slice(4, 6));
        if (month === 12) {
            currentDate = `${year + 1}01`;
        } else {
            currentDate = `${year}${String(month + 1).padStart(2, '0')}`;
        }
    }

    return missingMonths;
};