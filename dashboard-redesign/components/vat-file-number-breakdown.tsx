"use client"
import React, { useEffect, useMemo, useState } from "react"
import { formatNIS } from "@/utils/formatNIS"
import { ParsedData } from "@/types/header-data"
import { DistributionCard } from "./record-type-stats/distribution-card"
import { DetailedStatsTable } from "./record-type-stats/detailed-stats-table"
import { StatsCarousel } from "./record-type-stats/stats-carousel"
import { useRedFlagsState } from "@/hooks/useRedFlagsState"
import { RedFlagsSection } from "@/components/shared/red-flags-section"
import { Paginator } from "@/components/shared/paginator"
import type { RedFlagType, RedFlagAnomaly } from "@/types/red-flags"
import { useLanguage } from "@/context/language-context"
import { vatFileTranslations } from "@/translations/vat-file-breakdown"
import { fetchCompanyData } from "@/app/api/govAPI"


interface VatFileNumberBreakdownProps {
  parsedData: ParsedData,
  recordTypeFilter?: string[] // Add this to filter by input/output tax types
}

interface VatFileNumberStats {
  vatFileNumber: string
  count: number
  percentage: number
  totalInvoiceAmount: number
  vatPercentages: number[]
  avgVatPercentage: number
  sampleTransactions: Record<string, any>[]
}

export default function VatFileNumberBreakdown({ parsedData, recordTypeFilter }: VatFileNumberBreakdownProps) {
  const { language } = useLanguage()
  const isRTL = language === 'he'
  const t = vatFileTranslations[language]
  const { expandedAnomalies, setExpandedAnomalies } = useRedFlagsState()

  // 1. First declare all useState Hooks
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [companyNames, setCompanyNames] = useState<Record<string, string>>({})

  // 2. Then declare computed values that don't need Hooks
  const itemsPerPage = 10

  // 3. Then declare useMemo Hooks
  const totalTransactions = useMemo(() => {
    if (recordTypeFilter) {
      return parsedData.transactions.filter(t => {
        const recordType = t.recordType || t.RecordType || "Unknown"
        return recordTypeFilter.includes(recordType)
      }).length
    }
    return parsedData.transactions.length
  }, [parsedData.transactions, recordTypeFilter])

  const vatFileNumberStats = useMemo(() => {
    const stats: Record<string, VatFileNumberStats> = {}

    // Filter transactions based on record type if filter is provided
    const filteredTransactions = recordTypeFilter
      ? parsedData.transactions.filter(t => {
        const recordType = t.recordType || t.RecordType || "Unknown"
        return recordTypeFilter.includes(recordType)
      })
      : parsedData.transactions

    filteredTransactions.forEach((transaction) => {
      const vatFileNumber = transaction.vatFileNumber || transaction.VatFileNumber || "Unknown"

      if (!stats[vatFileNumber]) {
        stats[vatFileNumber] = {
          vatFileNumber,
          count: 0,
          percentage: 0,
          totalInvoiceAmount: 0,
          vatPercentages: [],
          avgVatPercentage: 0,
          sampleTransactions: [],
        }
      }

      stats[vatFileNumber].count++

      // Parse invoiceAmount robustly (remove +, leading zeros)
      const invoiceAmountRaw =
        transaction.invoiceAmount || transaction.InvoiceAmount || transaction.amount || transaction.Amount || "0"
      const invoiceAmount = parseInt(invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10) * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)

      if (!isNaN(invoiceAmount)) {
        stats[vatFileNumber].totalInvoiceAmount += invoiceAmount
      }

      // Collect taxRate for average VAT %
      const taxRateRaw = transaction.taxRate || transaction.taxrate || transaction.TaxRate || transaction.TAXRATE
      const taxRate = typeof taxRateRaw === "string"
        ? parseFloat(taxRateRaw.replace(",", "."))
        : typeof taxRateRaw === "number"
          ? taxRateRaw
          : null

      if (taxRate !== null && !isNaN(taxRate)) {
        stats[vatFileNumber].vatPercentages.push(taxRate)
      }

      // Keep first 3 transactions as samples
      if (stats[vatFileNumber].sampleTransactions.length < 3) {
        stats[vatFileNumber].sampleTransactions.push(transaction)
      }
    })

    // Calculate percentages and averages using totalTransactions from outside
    Object.values(stats).forEach((stat) => {
      stat.percentage = (stat.count / totalTransactions) * 100
      if (stat.vatPercentages.length > 0) {
        stat.avgVatPercentage = stat.vatPercentages.reduce((sum, v) => sum + v, 0) / stat.vatPercentages.length
      }
    })

    return Object.values(stats).sort((a, b) => b.totalInvoiceAmount - a.totalInvoiceAmount)  // was by count in the past 
  }, [parsedData.transactions, recordTypeFilter, totalTransactions])

  const totalItems = vatFileNumberStats.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Get current page items
  const currentVatFileNumbers = vatFileNumberStats.slice(startIndex, endIndex)


  const toggleExpand = (vatFileNumber: string) => {
    setExpanded((prev) => ({
      ...prev,
      [vatFileNumber]: !prev[vatFileNumber],
    }))
  }

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const getVatFileNumberColor = (index: number) => {
    // Cycle through a palette of Tailwind gradient color classes
    const colorClasses = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-slate-700 to-slate-800",
    ]
    return colorClasses[index % colorClasses.length]
  }
  function getBadgeColor(index: number): string {
    // Use a palette of Tailwind badge color classes for variety
    const badgeColors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-slate-200 text-slate-800",
    ]
    // Always return a string, fallback to first color if something goes wrong
    return badgeColors[index % badgeColors.length] || badgeColors[0]
  }

  const vatFileItems = currentVatFileNumbers.map(stat => ({
    id: stat.vatFileNumber,
    displayName: stat.vatFileNumber,
    companyName: companyNames[stat.vatFileNumber] || "Loading...", // Simple fallback
    count: stat.count,
    percentage: stat.percentage,
    totalAmount: stat.totalInvoiceAmount,
    avgPercentage: stat.avgVatPercentage
  }))

  // Determine if we're looking at input or output tax
  const taxType = useMemo(() => {
    if (recordTypeFilter?.some(t => ['T', 'C', 'K', 'R', 'P', 'H'].includes(t))) {
      return 'input'
    }
    if (recordTypeFilter?.some(t => ['S', 'L', 'M', 'Y', 'I'].includes(t))) {
      return 'output'
    }
    return undefined
  }, [recordTypeFilter])

  // Define VAT file specific red flags
  const vatFileAnomalies = useMemo(() => {
    const anomalies: Record<RedFlagType, RedFlagAnomaly> = {
      inputTaxAnomaly: {
        count: 0,
        transactions: [],
        description: "High concentration of input tax in top 3 transactions",
        severity: 'high'
      },
      outputTaxAnomaly: {
        count: 0,
        transactions: [],
        description: "Output tax transactions with suspicious patterns",
        severity: 'high'
      },
      unidentified: {
        count: 0,
        transactions: [],
        description: "No unidentified anomalies detected",
        severity: 'low'
      },
      standardRatedSales: {
        count: 0,
        transactions: [],
        description: "No standard rated sales anomalies detected",
        severity: 'low'
      },
      domesticPurchases: {
        count: 0,
        transactions: [],
        description: "No domestic purchases anomalies detected",
        severity: 'low'
      }
    }

    // Only process for input tax or all records view
    if (taxType === 'input' || !taxType) {
      const inputTransactions = parsedData.transactions.filter(t => {
        const recordType = t.recordType || t.RecordType
        return ['T', 'C', 'K', 'R', 'P', 'H'].includes(recordType)
      })

      if (inputTransactions.length > 0) {
        const totalInputAmount = inputTransactions.reduce((sum, t) => {
          const invoiceAmountRaw = t.invoiceAmount || t.InvoiceAmount || t.amount || t.Amount || "0"
          const invoiceAmount = parseInt(invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10)
            * (invoiceAmountRaw.trim().startsWith("-") ? -1 : 1)
          return sum + (isNaN(invoiceAmount) ? 0 : invoiceAmount)
        }, 0)

        // Get top 3 transactions by amount (positive values only)
        const top3Transactions = [...inputTransactions]
          .filter(t => {
            const amountRaw = t.invoiceAmount || t.InvoiceAmount || t.amount || t.Amount || "0"
            const amount = parseInt(amountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10)
            return !amountRaw.trim().startsWith("-") && amount > 0
          })
          .sort((a, b) => {
            const amountARaw = a.invoiceAmount || a.InvoiceAmount || a.amount || a.Amount || "0"
            const amountBRaw = b.invoiceAmount || b.InvoiceAmount || b.amount || b.Amount || "0"

            const amountA = parseInt(amountARaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10)
            const amountB = parseInt(amountBRaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10)

            return amountB - amountA
          })
          .slice(0, 3)

        const top3Amount = top3Transactions.reduce((sum, t) => {
          const invoiceAmountRaw = t.invoiceAmount || t.InvoiceAmount || t.amount || t.Amount || "0"
          const invoiceAmount = parseInt(invoiceAmountRaw.replace(/^\+?0+/, "").replace(/^$/, "0"), 10)
          return sum + (isNaN(invoiceAmount) ? 0 : invoiceAmount)
        }, 0)

        if (totalInputAmount > 0 && top3Amount > 0) {
          const concentrationPercentage = (top3Amount / totalInputAmount) * 100

          if (concentrationPercentage > 20) {
            const formattedTop3 = top3Transactions.map(t => ({
              recordType: t.recordType || t.RecordType,
              invoiceAmount: t.invoiceAmount || t.InvoiceAmount,
              invoiceDate: t.invoiceDate || t.InvoiceDate,
              reference: t.reference || t.Reference || t.referenceNumber || t.ReferenceNumber,
              taxRate: t.taxRate || t.taxrate || t.TaxRate || t.TAXRATE,
              vatFileNumber: t.vatFileNumber || t.VatFileNumber,
            }))

            anomalies.inputTaxAnomaly = {
              count: formattedTop3.length,
              transactions: formattedTop3,
              description: `Top 3 input tax transactions represent ${concentrationPercentage.toFixed(1)}% of total input tax (₪${formatNIS(top3Amount)} out of ₪${formatNIS(totalInputAmount)})`,
              severity: 'high'
            }
          }
        }
      }
    }

    return anomalies
  }, [parsedData, taxType])

  // Update the visibleFlags useMemo to check for actual anomalies
  const visibleFlags = useMemo(() => {
    const flags: RedFlagType[] = []

    if (taxType === 'input' || !taxType) {
      // Only add input tax anomaly if there are transactions
      if (vatFileAnomalies.inputTaxAnomaly.count > 0) {
        flags.push('inputTaxAnomaly')
      }
    }

    if (taxType === 'output' || !taxType) {
      // Only add output tax anomaly if there are transactions
      if (vatFileAnomalies.outputTaxAnomaly.count > 0) {
        flags.push('outputTaxAnomaly')
      }
    }

    return flags
  }, [taxType, vatFileAnomalies])

  // Add this after other useEffect hooks
  useEffect(() => {
    const fetchCompanyNames = async () => {
      const uniqueVatIds = [...new Set(vatFileNumberStats.map(stat => stat.vatFileNumber))]

      for (const vatId of uniqueVatIds) {
        // Skip if we already have this company name
        if (companyNames[vatId]) continue

        const data = await fetchCompanyData(vatId)
        if (data?.records && data.records.length > 0) {
          setCompanyNames(prev => ({
            ...prev,
            [vatId]: data.records[0]["שם חברה"] || "Not found"
          }))
        }
      }
    }

    fetchCompanyNames()
  }, [vatFileNumberStats])

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Summary Stats */}
        <StatsCarousel
          totalTransactions={totalTransactions}
          totalAmount={vatFileNumberStats.reduce((sum, stat) => sum + stat.totalInvoiceAmount, 0)}
          totalItems={totalItems}
          mostCommonItem={vatFileNumberStats[0]?.vatFileNumber}
          topItemShare={vatFileNumberStats[0]?.percentage}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          itemType="vatFile"
          translations={t.stats} // Simply pass the entire stats object since it matches the expected structure
        />

        {/* Pagination Controls - Top */}
        <div className="mb-6">
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            itemName={language === "he" ? "מספרי תיקי מע״מ" : "VAT File Numbers"}
            translations={{
              showing: t.pagination.showing,
              to: t.pagination.to,
              of: t.pagination.of,
              page: t.pagination.page,
              previous: t.pagination.previous,
              next: t.pagination.next
            }}
          />
        </div>

        {/* VAT File Number Distribution */}
        <DistributionCard
          title={t.distribution.title}
          description={t.distribution.description}
          items={vatFileItems}
          totalAmount={vatFileNumberStats.reduce((sum, stat) => sum + stat.totalInvoiceAmount, 0)}
          getItemColor={getVatFileNumberColor}
          getBadgeColor={getBadgeColor}
          translations={t.distribution}
          startIndex={startIndex}
        />

        {/* Detailed Breakdown Table */}
        <DetailedStatsTable
          title={t.detailedStats.title}
          description={t.detailedStats.description}
          items={currentVatFileNumbers.map(stat => ({
            id: stat.vatFileNumber,
            displayName: stat.vatFileNumber,
            companyName: companyNames[stat.vatFileNumber] || "Loading...", // Simple fallback
            count: stat.count,
            percentage: stat.percentage,
            totalAmount: stat.totalInvoiceAmount,
            avgPercentage: stat.avgVatPercentage
          }))}
          parsedData={parsedData}
          expanded={expanded}
          toggleExpand={toggleExpand}
          getItemColor={getVatFileNumberColor}
          identifierKey="vatFileNumber"
          translations={t.detailedStats}
        />

        <div className="mt-6">
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPreviousPage={previousPage}
            onNextPage={nextPage}
            itemName={language === "he" ? "מספרי תיקי מע״מ" : "VAT File Numbers"}
            translations={{
              showing: t.pagination.showing,
              to: t.pagination.to,
              of: t.pagination.of,
              page: t.pagination.page,
              previous: t.pagination.previous,
              next: t.pagination.next
            }}
          />
        </div>

        {/* Red Flags Section */}
        <RedFlagsSection
          anomalies={vatFileAnomalies}
          visibleFlags={visibleFlags}
          expandedAnomalies={expandedAnomalies}
          setExpandedAnomalies={setExpandedAnomalies}
          noFlagsMessage={t.redFlags.noFlags}
          translations={{
            title: t.redFlags.title,
            description: t.redFlags.description,
            noFlags: t.redFlags.noFlags,
            transactionDetails: t.redFlags.transactionDetails,
            inputTaxAnomaly: {
              title: t.redFlags.inputTaxAnomaly.title,
              description: t.redFlags.inputTaxAnomaly.description,
              highRisk: t.redFlags.inputTaxAnomaly.highRisk
            },
            outputTaxAnomaly: {
              title: t.redFlags.outputTaxAnomaly.title,
              description: t.redFlags.outputTaxAnomaly.description,
              invalidTaxRate: t.redFlags.outputTaxAnomaly.invalidTaxRate
            },
            unidentified: {
              title: '',
              description: '',
              highRisk: ''
            },
            standardRatedSales: {
              title: '',
              description: '',
              invalidTaxRate: ''
            },
            domesticPurchases: {
              title: '',
              description: '',
              invalidTaxRate: ''
            }
          }}
        />
      </div>
    </div>
  )
}

