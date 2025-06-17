"use client"

import { useState } from "react"
import { useData } from "@/context/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Download, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCellValue } from "@/utils/formatCellValue"

export default function TransactionsPage() {
  const { parsedData } = useData()
  const [transactionFilter, setTransactionFilter] = useState("")
  const [selectedColumn, setSelectedColumn] = useState<string>("all")

  if (!parsedData) {
    return null
  }

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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Transaction Data</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">View and analyze all transactions in your PCN file.</p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-900">Transaction Data</CardTitle>
              <CardDescription>
                Showing {filteredTransactions.length.toLocaleString()} of{" "}
                {parsedData.transactions.length.toLocaleString()} transactions
              </CardDescription>
            </div>
            <Button variant="outline" className="border-slate-300">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filter Controls */}
          <div className="flex gap-4 items-end mb-6">
            <div className="flex-1">
              <Label htmlFor="transaction-filter" className="text-sm font-medium text-slate-700">
                Search Transactions
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <Input
                  id="transaction-filter"
                  placeholder="Search across all fields..."
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="column-select" className="text-sm font-medium text-slate-700">
                Filter Column
              </Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger id="column-select" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Columns</SelectItem>
                  {transactionColumns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
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
                    <TableHead key={column} className="font-semibold text-slate-900">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => {
                  const sign = transaction.cancelOrCreditSign === "-" ? "-" : "+"
                  const isNegative = sign === "-"
                  return (
                    <TableRow
                      key={index}
                      className={`hover:bg-slate-50 ${
                        isNegative ? "bg-red-100" : index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
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

          {filteredTransactions.length === 0 && transactionFilter && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600">Try adjusting your search terms or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
