interface CompanyResponse {
    records: {
        "שם חברה": string;
        "מספר חברה": string;
        "סטטוס": string;
        // Add other fields as needed
    }[];
    total: number;
}

export const fetchCompanyData = async (companyId: string): Promise<CompanyResponse | undefined> => {
    try {
        const response = await fetch(`/api/company/${companyId}`);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Failed to fetch company data:', error);
        return undefined;
    }
};
