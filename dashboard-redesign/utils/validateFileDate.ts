export const validateFileDate = async (file: File, targetDate: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.split('\n');
            const headerLine = lines.find(line => line.startsWith('O'));

            if (headerLine && headerLine.length >= 10) {
                // Extract year and month from the header (positions 19-24 in PCN format)
                const fileDate = headerLine.substring(19, 25); // Gets "260201"

                // Convert YY to YYYY (assuming 20YY)
                const fileYear = "20" + fileDate.substring(0, 2); // "2026"
                const fileMonth = fileDate.substring(2, 4); // "02"
                const convertedFileDate = fileYear + fileMonth; // "202602"

                const targetYearMonth = targetDate.replace(/\D/g, ''); // Gets "202602"

                // Add debug logs
                console.log('File Content:', {
                    headerLine: headerLine,
                    originalFileDate: fileDate,
                    convertedFileDate: convertedFileDate,
                    targetDate: targetDate,
                    processedTargetDate: targetYearMonth,
                    comparison: convertedFileDate === targetYearMonth
                });

                resolve(convertedFileDate === targetYearMonth);
            }
            resolve(false);
        };
        reader.onerror = () => {
            console.error('Error reading file');
            resolve(false);
        };
        reader.readAsText(file);
    });
};