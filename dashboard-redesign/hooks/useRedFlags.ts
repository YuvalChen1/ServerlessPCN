import { useMemo } from "react"
import { ParsedData } from "@/types/header-data"

export interface RedFlagAnomaly {
  count: number
  transactions: Record<string, any>[]
}

export function useRedFlags(parsedData: ParsedData) {
  // Unidentified Customers Anomalies
  const unidentifiedCustomersAnomalies = useMemo(() => {
    const anomalies = parsedData.transactions.filter(t => {
      const recordType = t.recordType || t.RecordType || "Unknown"
      if (recordType !== 'L') return false

      const invoiceAmountRaw = t.invoiceAmount || t.InvoiceAmount || t.amount || t.Amount || "0"
      const invoiceAmount = parseInt(
        invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"),
        10
      ) * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)

      return !isNaN(invoiceAmount) && invoiceAmount > 5000
    })

    return {
      count: anomalies.length,
      transactions: anomalies
    }
  }, [parsedData.transactions])

  // Standard Rated Sales Tax Rate Anomalies
  const standardRatedSalesTaxRateAnomalies = useMemo(() => {
    const anomalies = parsedData.transactions.filter(t => {
      const recordType = t.recordType || t.RecordType || "Unknown"
      if (recordType !== 'S') return false

      const taxRateRaw = t.taxRate || t.taxrate || t.TaxRate || t.TAXRATE
      const taxRate = typeof taxRateRaw === "string"
        ? parseFloat(taxRateRaw.replace(",", "."))
        : typeof taxRateRaw === "number"
          ? taxRateRaw
          : null

      if (taxRate === null || isNaN(taxRate)) return false
      return Math.abs(taxRate - 18) > 0.05
    })

    return {
      count: anomalies.length,
      transactions: anomalies
    }
  }, [parsedData.transactions])

  // Domestic Purchases Tax Rate Anomalies
  const domesticPurchasesTaxRateAnomalies = useMemo(() => {
    const anomalies = parsedData.transactions.filter(t => {
      const recordType = t.recordType || t.RecordType || "Unknown"
      if (recordType !== 'T') return false

      const taxRateRaw = t.taxRate || t.taxrate || t.TaxRate || t.TAXRATE
      const taxRate = typeof taxRateRaw === "string"
        ? parseFloat(taxRateRaw.replace(",", "."))
        : typeof taxRateRaw === "number"
          ? taxRateRaw
          : null

      if (taxRate === null || isNaN(taxRate)) return false
      return Math.abs(taxRate - 18) > 0.05
    })

    return {
      count: anomalies.length,
      transactions: anomalies
    }
  }, [parsedData.transactions])

  return {
    unidentifiedCustomersAnomalies,
    standardRatedSalesTaxRateAnomalies,
    domesticPurchasesTaxRateAnomalies
  }
}