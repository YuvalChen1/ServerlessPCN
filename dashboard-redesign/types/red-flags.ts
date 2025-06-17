export type RedFlagSeverity = 'low' | 'medium' | 'high'

export interface Transaction {
    recordType?: string
    RecordType?: string
    invoiceAmount?: string | number
    InvoiceAmount?: string | number
    invoiceDate?: string
    InvoiceDate?: string
    reference?: string
    Reference?: string
    referenceNumber?: string
    ReferenceNumber?: string
    taxRate?: string | number
    taxrate?: string | number
    TaxRate?: string | number
    vatFileNumber?: string
    VatFileNumber?: string
}

export interface RedFlagAnomaly {
    count: number
    transactions: Transaction[]
    description: string
    severity: RedFlagSeverity
}

export type RedFlagType =
    | 'unidentified'
    | 'standardRatedSales'
    | 'domesticPurchases'
    | 'inputTaxAnomaly'
    | 'outputTaxAnomaly'

export interface RedFlagsSectionProps {
    anomalies: Record<RedFlagType, RedFlagAnomaly>
    visibleFlags: RedFlagType[]
    expandedAnomalies: Record<RedFlagType, boolean>
    setExpandedAnomalies: (value: Record<RedFlagType, boolean>) => void
    noFlagsMessage?: string
    translations: RedFlagTranslations
}

interface RedFlagTranslations {
  title: string
  description: string
  noFlags: string
  transactionDetails: {
    recordType: string
    taxRate: string
    date: string
    referenceNumber: string
    transactionsFound: string
  }
  inputTaxAnomaly: RedFlagTypeTranslation
  outputTaxAnomaly: RedFlagTypeTranslation
  unidentified: RedFlagTypeTranslation
  standardRatedSales: RedFlagTypeTranslation
  domesticPurchases: RedFlagTypeTranslation
}

interface RedFlagTypeTranslation {
  title: string
  description: string
  highRisk?: string
  invalidTaxRate?: string
}