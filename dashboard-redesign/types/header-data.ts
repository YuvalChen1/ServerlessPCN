export interface HeaderData {
    reportDate: string;
    fileCreationDate: string;
    companyId: string;
    totalTransactionRecords: string;
    totalAmountToPay: string;
    totalTaxableAmount: string;
    vatOnTaxable: string;
    otherRateDealsAmount: string;
    otherRateVat: string;
    vatExemptAmount: string;
    otherInputVat: string;
    equipmentInputVat: string;
    otherAndEquipmentRecordCount: string;
}

export interface ParsedData {
    header: HeaderData[];
    transactions: any[]; // You might want to type this more specifically
    footer: string;
}