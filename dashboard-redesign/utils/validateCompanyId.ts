export const validateCompanyId = async (file: File, expectedCompanyId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.split('\n');
            const headerLine = lines.find(line => line.startsWith('O'));

            if (headerLine && headerLine.length >= 10) {
                const fileCompanyId = headerLine.substring(1, 10);
                resolve(fileCompanyId === expectedCompanyId);
            }
            resolve(false);
        };
        reader.onerror = () => resolve(false);
        reader.readAsText(file);
    });
};
