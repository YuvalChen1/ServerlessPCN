"use client"
import React from "react"
import { useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { ParsedData } from "@/types/header-data"
import { useRedFlags } from "@/hooks/useRedFlags"
import { useRedFlagsState } from "@/hooks/useRedFlagsState"
import { RedFlagsSection } from "./shared/red-flags-section"
import { StatsCarousel } from "./record-type-stats/stats-carousel"
import { DistributionCard } from "./record-type-stats/distribution-card"
import { DetailedStatsTable } from "./record-type-stats/detailed-stats-table"
import type { RedFlagType, RedFlagAnomaly, RedFlagsSectionProps } from '@/types/red-flags'
import { RECORD_TYPE_MAPPING } from "@/utils/record-type-mapping"
import { useLanguage } from "@/context/language-context"
import { recordTypeTranslations } from "@/translations/record-type-breakdown"
import { parseAmount } from '@/utils/calculateAmount'

interface RecordTypeBreakdownProps {
  parsedData: ParsedData,
  recordTypeFilter?: string[] // Add this to allow filtering record types
}

interface RecordTypeStats {
  recordType: string
  displayName: string // Add this field
  count: number
  percentage: number
  totalInvoiceAmount: number
  vatPercentages: number[]
  avgVatPercentage: number
  sampleTransactions: Record<string, any>[]
}

// Import RedFlagType from the appropriate location (adjust the path as needed)
// type RedFlagKey = 'unidentified' | 'standardRatedSales' | 'domesticPurchases'

// Add carousel styles at the top of the file after imports
const carouselStyles = {
  arrowButton: `
    absolute top-1/2 -translate-y-1/2 p-3
    rounded-full bg-white shadow-lg
    hover:bg-slate-50 transition-all duration-300
    border border-slate-200
    transform hover:scale-110
    animate-float
  `,
  arrowIcon: `
    h-5 w-5 text-slate-600
    transition-transform duration-300
    group-hover:text-slate-900
  `
}

// Add this constant at the top of the file
const ALL_RECORD_TYPES = ['S', 'L', 'M', 'Y', 'I', 'C', 'R', 'P', 'H', 'T', 'K'];

export default function RecordTypeBreakdown({ parsedData, recordTypeFilter }: RecordTypeBreakdownProps) {
  const { language } = useLanguage()
  const t = recordTypeTranslations[language]

  // Define relevantTypes based on recordTypeFilter prop
  const relevantTypes = useMemo(() => {
    if (recordTypeFilter) {
      return recordTypeFilter;
    }
    // When no filter is provided, return ALL_RECORD_TYPES instead of getting from transactions
    return ALL_RECORD_TYPES;
  }, [recordTypeFilter])

  const { expandedAnomalies, setExpandedAnomalies } = useRedFlagsState()
  const {
    unidentifiedCustomersAnomalies,
    standardRatedSalesTaxRateAnomalies,
    domesticPurchasesTaxRateAnomalies
  } = useRedFlags(parsedData)

  // Modify the recordTypeStats useMemo to use the filter
  const recordTypeStats = useMemo(() => {
    const stats: Record<string, RecordTypeStats> = {}

    // Initialize all relevant record types with zero values
    relevantTypes.forEach(recordType => {
      stats[recordType] = {
        recordType,
        displayName: t.recordTypes[recordType as keyof typeof t.recordTypes] || recordType,
        count: 0,
        percentage: 0,
        totalInvoiceAmount: 0,
        vatPercentages: [],
        avgVatPercentage: 0,
        sampleTransactions: []
      }
    })

    // Filter and process transactions
    const relevantTransactions = parsedData.transactions.filter(t => {
      const recordType = t.recordType || t.RecordType || "Unknown"
      return relevantTypes.includes(recordType)
    })

    const totalTransactions = relevantTransactions.length

    // Group and calculate
    relevantTransactions.forEach((transaction) => {
      const recordType = transaction.recordType || transaction.RecordType || "Unknown"
      const invoiceAmountStr = transaction.invoiceAmount || transaction.InvoiceAmount || "0"

      stats[recordType].count++

      // Use parseAmount utility for consistent calculation
      const amount = parseAmount(invoiceAmountStr)
      stats[recordType].totalInvoiceAmount += amount

      // Calculate VAT percentage
      const vatAmount = parseAmount(transaction.vatAmountInInvoice?.toString() || "0")
      if (amount !== 0) {
        stats[recordType].vatPercentages.push((vatAmount / amount) * 100)
      }
    })

    // Calculate percentages and prepare final stats
    return Object.values(stats)
      .map(stat => ({
        ...stat,
        percentage: (stat.count / totalTransactions) * 100,
        avgVatPercentage: stat.vatPercentages.length > 0
          ? stat.vatPercentages.reduce((sum, v) => sum + v, 0) / stat.vatPercentages.length
          : 0
      }))
      .sort((a, b) => Math.abs(b.totalInvoiceAmount) - Math.abs(a.totalInvoiceAmount))
  }, [parsedData.transactions, recordTypeFilter, relevantTypes])

  const totalTransactions = useMemo(() => {
    // If we have a filter, only count transactions of those types
    if (recordTypeFilter) {
      return parsedData.transactions.filter(t => {
        const recordType = t.recordType || t.RecordType || "Unknown"
        return recordTypeFilter.includes(recordType)
      }).length
    }
    // Otherwise return total count
    return parsedData.transactions.length
  }, [parsedData.transactions, recordTypeFilter])

  // Update the totalAmount calculation
  const totalAmount = useMemo(() => {
    return recordTypeStats.reduce((sum, stat) => {
      console.log(stat.totalInvoiceAmount, "Total Invoice Amount for", stat.recordType);
      console.log(stat);
      return sum + parseAmount(stat.totalInvoiceAmount.toString())
    }, 0)
  }, [recordTypeStats]);

  // First, calculate total amount from all records regardless of filter
  const totalAllRecordsAmount = useMemo(() => {
    // Calculate total from all transactions regardless of current filter
    return parsedData.transactions.reduce((sum, transaction) => {
      const invoiceAmountRaw = transaction.invoiceAmount ||
        transaction.InvoiceAmount ||
        transaction.amount ||
        transaction.Amount || "0"

      const invoiceAmount = parseInt(
        invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"),
        10
      ) * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)

      return !isNaN(invoiceAmount) ? sum + invoiceAmount : sum
    }, 0)
  }, [parsedData.transactions])

  // Then update the turnover calculations
  const { inputAmount, outputAmount } = useMemo(() => {
    const input = parsedData.transactions
      .filter(t => ['T', 'C', 'K', 'R', 'P', 'H'].includes(t.recordType || t.RecordType || "Unknown"))
      .reduce((sum, transaction) => {
        const invoiceAmountRaw = transaction.invoiceAmount ||
          transaction.InvoiceAmount ||
          transaction.amount ||
          transaction.Amount || "0"

        const invoiceAmount = parseInt(
          invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"),
          10
        ) * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)

        return !isNaN(invoiceAmount) ? sum + invoiceAmount : sum
      }, 0)

    const output = parsedData.transactions
      .filter(t => ['S', 'L', 'M', 'Y', 'I'].includes(t.recordType || t.RecordType || "Unknown"))
      .reduce((sum, transaction) => {
        const invoiceAmountRaw = transaction.invoiceAmount ||
          transaction.InvoiceAmount ||
          transaction.amount ||
          transaction.Amount || "0"

        const invoiceAmount = parseInt(
          invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"),
          10
        ) * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)

        return !isNaN(invoiceAmount) ? sum + invoiceAmount : sum
      }, 0)

    return { inputAmount: input, outputAmount: output }
  }, [parsedData.transactions])

  const getRecordTypeColor = (index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-red-500 to-red-600",
    ]
    return colors[index % colors.length]
  }

  const getBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-green-100 text-green-800 border-green-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-indigo-100 text-indigo-800 border-indigo-200",
      "bg-teal-100 text-teal-800 border-teal-200",
      "bg-red-100 text-red-800 border-red-200",
    ]
    return colors[index % colors.length]
  }

  // State to track expanded record types
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (recordType: string) => {
    setExpanded((prev) => ({
      ...prev,
      [recordType]: !prev[recordType],
    }))
  }

  // Add this state for carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Conditional rendering flags
  const showUnidentifiedCustomersFlag = !recordTypeFilter ||
    recordTypeFilter.some(t => ['S', 'L', 'M', 'Y', 'I'].includes(t));
  const showStandardRatedSalesFlag = !recordTypeFilter ||
    recordTypeFilter.some(t => ['S'].includes(t));
  const showDomesticPurchasesFlag = !recordTypeFilter ||
    recordTypeFilter.some(t => ['T'].includes(t));

  // Prepare record type items for distribution card
  const recordTypeItems = recordTypeStats.map(stat => ({
    id: stat.recordType,
    displayName: t.recordTypes[stat.recordType as keyof typeof t.recordTypes], // Use translated name
    subText: `(${stat.recordType})`, // Keep the record type code
    count: stat.count,
    percentage: stat.percentage,
    totalAmount: stat.totalInvoiceAmount,
    avgPercentage: stat.avgVatPercentage
  }))

  // First, add this visibleFlags calculation using useMemo
  const visibleFlags = useMemo(() => {
    const flags: RedFlagType[] = []

    if (showUnidentifiedCustomersFlag) {
      flags.push('unidentified')
    }
    if (showStandardRatedSalesFlag) {
      flags.push('standardRatedSales')
    }
    if (showDomesticPurchasesFlag) {
      flags.push('domesticPurchases')
    }

    return flags
  }, [showUnidentifiedCustomersFlag, showStandardRatedSalesFlag, showDomesticPurchasesFlag])

  // Prepare anomalies object for RedFlagsSection
  const anomalies = {
    unidentified: {
      ...unidentifiedCustomersAnomalies,
      description: t.redFlags.unidentified.description,
      severity: "medium" as const,
    },
    standardRatedSales: {
      ...standardRatedSalesTaxRateAnomalies,
      description: t.redFlags.standardRatedSales.description,
      severity: "high" as const,
    },
    domesticPurchases: {
      ...domesticPurchasesTaxRateAnomalies,
      description: t.redFlags.domesticPurchases.description,
      severity: "medium" as const,
    },
    inputTaxAnomaly: {
      description: "Input tax anomaly",
      severity: "low" as const,
      count: 0,
      transactions: [],
    },
    outputTaxAnomaly: {
      description: "Output tax anomaly",
      severity: "low" as const,
      count: 0,
      transactions: [],
    },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCarousel
          totalTransactions={totalTransactions}
          totalAmount={totalAmount}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          totalAllRecordsAmount={totalAllRecordsAmount}
          recordTypeStats={recordTypeStats}
          recordTypeFilter={recordTypeFilter}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          itemType="recordType"
          totalItems={recordTypeStats.length}
          translations={{
            totalTransactions: t.stats.totalTransactions,
            totalAmount: t.stats.totalAmount,
            inputTurnover: t.stats.inputTurnover,
            outputTurnover: t.stats.outputTurnover,
            topTypeShare: t.stats.topTypeShare,
            mostCommonType: t.stats.mostCommonType,
            vatFileNumbers: t.stats.vatFileNumbers,
            amountDue: t.stats.amountDue,
            noData: t.stats.noData,
            recordTypes: t.recordTypes
          }}
        />

        <DistributionCard
          title={t.distribution.title}
          description={t.distribution.description}
          items={recordTypeItems}
          getItemColor={getRecordTypeColor}
          getBadgeColor={getBadgeColor}
          translations={t.distribution}
          totalAmount={totalAmount} // Add this prop
        />

        <DetailedStatsTable
          title={t.detailedStats.title}
          description={t.detailedStats.description}
          items={recordTypeStats.map(stat => ({
            id: stat.recordType,
            displayName: t.recordTypes[stat.recordType as keyof typeof t.recordTypes], // Use translated name
            subText: `(${stat.recordType})`, // Keep the record type code in parentheses
            count: stat.count,
            percentage: stat.percentage,
            totalAmount: stat.totalInvoiceAmount,
            avgPercentage: stat.avgVatPercentage
          }))}
          parsedData={parsedData}
          expanded={expanded}
          toggleExpand={toggleExpand}
          getItemColor={getRecordTypeColor}
          identifierKey="recordType"
          translations={{
            ...t.detailedStats,
            transactionFields: t.detailedStats.transactionFields
          }}
        />

        <RedFlagsSection
          anomalies={anomalies}
          visibleFlags={visibleFlags}
          expandedAnomalies={expandedAnomalies}
          setExpandedAnomalies={setExpandedAnomalies}
          noFlagsMessage={t.redFlags.noFlags}
          translations={t.redFlags}
        />
      </div>
    </div>
  )
}
