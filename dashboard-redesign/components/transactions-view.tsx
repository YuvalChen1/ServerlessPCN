"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCellValue } from "@/utils/formatCellValue"
import { HeaderData } from "@/types/header-data"
import { useLanguage } from "@/context/language-context"
import { transactionsViewTranslations } from "@/translations/transactions-view"
import { dataHeaderTranslations } from "@/translations/data-headers"
import { cn } from "@/lib/utils"


interface TransactionsViewProps {
  parsedData: {
    header: HeaderData[];
    transactions: Record<string, any>[]
    footer: string
  }
}

export default function TransactionsView({ parsedData }: TransactionsViewProps) {
  const { language } = useLanguage()
  const isRTL = language === 'he'
  const t = transactionsViewTranslations[language]

  const [transactionFilter, setTransactionFilter] = useState("")
  const [selectedColumn, setSelectedColumn] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100

  const transactionColumns = parsedData.transactions[0]
    ? Object.keys(parsedData.transactions[0]).filter((col) => col !== "referenceGroup" && col !== "cancelOrCreditSign")
    : []

  const filteredTransactions = parsedData.transactions.filter((transaction) => {
    if (!transactionFilter) return true

    if (selectedColumn === "all") {
      return Object.values(transaction).some((value) =>
        String(value).toLowerCase().includes(transactionFilter.toLowerCase()),
      )
    } else {
      return String(transaction[selectedColumn] || "")
        .toLowerCase()
        .includes(transactionFilter.toLowerCase())
    }
  })

  // Calculate pagination values
  const totalItems = filteredTransactions.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredTransactions.slice(startIndex, endIndex)

  // Add pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [transactionFilter, selectedColumn])

  const formatColumnHeader = (column: string) => {
    return dataHeaderTranslations[language][column as keyof typeof dataHeaderTranslations.en] ||
      column
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim()
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className={cn(
        "bg-white border-b border-slate-200",
        isRTL && "text-right"
      )}>
        <div className={cn(
          "flex items-center justify-between",
          isRTL && "flex-row-reverse"
        )}>
          <div>
            <CardTitle className="text-slate-900">{t.title}</CardTitle>
            <CardDescription>
              {t.showing} {filteredTransactions.length.toLocaleString()} {t.of}{" "}
              {parsedData.transactions.length.toLocaleString()} {t.transactions}
            </CardDescription>
          </div>
          <Button variant="outline" className="border-slate-300">
            <Download className="h-4 w-4 mr-2" />
            {t.export.button}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Filter Controls */}
        <div className={cn(
          "flex gap-4 items-end mb-6",
          isRTL && "flex-row-reverse"
        )}>
          <div className="flex-1">
            <Label htmlFor="transaction-filter" className="text-sm font-medium text-slate-700">
              {t.search.label}
            </Label>
            <div className={cn(
              "flex items-center gap-2 mt-1",
              isRTL && "flex-row-reverse"
            )}>
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <Input
                id="transaction-filter"
                placeholder={t.search.placeholder}
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>
          </div>
          <div className="w-48">
            <Label htmlFor="column-select" className="text-sm font-medium text-slate-700">
              {t.filter.label}
            </Label>
            <Select
              value={selectedColumn}
              onValueChange={setSelectedColumn}
            >
              <SelectTrigger
                id="column-select"
                className={cn("mt-1", isRTL && "text-right")}
              >
                <SelectValue placeholder={t.filter.allColumns}>
                  {selectedColumn === 'all'
                    ? t.filter.allColumns
                    : formatColumnHeader(selectedColumn)
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filter.allColumns}</SelectItem>
                {transactionColumns.map((column) => (
                  <SelectItem
                    key={column}
                    value={column}
                    className={cn(isRTL && "text-right")}
                  >
                    {formatColumnHeader(column)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Transactions Table */}
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-8"></TableHead>
                {transactionColumns.map((column) => (
                  <TableHead
                    key={column}
                    className={cn(
                      "font-semibold text-slate-900",
                      isRTL && "text-right"
                    )}
                  >
                    {formatColumnHeader(column)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((transaction, index) => {
                const sign = transaction.cancelOrCreditSign === "-" ? "-" : "+"
                const isNegative = sign === "-"
                return (
                  <TableRow
                    key={index}
                    className={`hover:bg-slate-50 ${isNegative ? "bg-red-100" : index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                  >
                    <TableCell
                      className="font-bold text-lg text-center"
                      style={{ color: isNegative ? "#b91c1c" : "#16a34a" }}
                    >
                      {sign}
                    </TableCell>
                    {transactionColumns.map((column, colIndex) => (
                      <TableCell
                        key={column}
                        className={colIndex === 0 ? "font-medium text-slate-900" : "text-slate-700"}
                      >
                        {formatCellValue(transaction[column], column)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className={cn(
          "mt-6 flex items-center justify-between border-t border-slate-200 pt-4",
          isRTL && "flex-row"
        )}>
          <div className="text-sm text-slate-600">
            {t.pagination.showing} {startIndex + 1} {t.pagination.to} {Math.min(endIndex, totalItems)} {t.pagination.of} {totalItems} {t.pagination.transactions}
          </div>
          <div className={cn(
            "flex items-center gap-2",
            isRTL && "flex-row"
          )}>
            <Button
              variant="outline"
              size="sm"
              onClick={previousPage}
              disabled={currentPage === 1}
              className="border-slate-200"
            >
              {isRTL ? <ChevronRight className="h-4 w-4 ml-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
              {t.pagination.previous}
            </Button>
            <div className="text-sm text-slate-600 px-2">
              {t.pagination.page} {currentPage} {t.pagination.of} {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="border-slate-200"
            >
              {t.pagination.next}
              {isRTL ? <ChevronLeft className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>

        {filteredTransactions.length === 0 && transactionFilter && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t.search.noResults.title}</h3>
            <p className="text-slate-600">{t.search.noResults.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
