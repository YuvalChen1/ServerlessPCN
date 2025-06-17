import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { formatCellValue } from "@/utils/formatCellValue"
import { formatNIS } from "@/utils/formatNIS"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"
import { parseAmount } from '@/utils/calculateAmount';

const getTransactionAmount = (transaction: any) => {
    const amountStr = transaction.invoiceAmount || transaction.InvoiceAmount || transaction.amount || transaction.Amount || "0";
    return parseAmount(amountStr);
}

const calculateTotalAmount = (transactions: any[]) => {
    return transactions.reduce((sum, transaction) => {
        const amount = getTransactionAmount(transaction);
        return sum + amount;
    }, 0);
}

interface DetailedStatsTableProps {
    title: string
    description: string
    items: Array<{
        id: string
        displayName: string
        companyName?: string // Add this
        subText?: string
        count: number
        percentage: number
        totalAmount?: number
        avgPercentage?: number
        transactions?: any[]
    }>
    parsedData: any
    expanded: Record<string, boolean>
    toggleExpand: (id: string) => void
    getItemColor: (index: number) => string
    identifierKey: string
    excludeColumns?: string[]
    translations: {
        name: string
        count: string
        percentage: string
        totalAmount: string
        avgVatRate: string
        transactions: string
        showTransactions: string
        hideTransactions: string
        transactionFields: Record<string, string>
    }
}

export function DetailedStatsTable({
    title,
    description,
    items,
    parsedData,
    expanded,
    toggleExpand,
    getItemColor,
    identifierKey,
    excludeColumns = ["referenceGroup", "cancelOrCreditSign"],
    translations
}: DetailedStatsTableProps) {
    const { language } = useLanguage()
    const isRTL = language === 'he'

    const formatFieldName = (field: string): string => {
        return translations.transactionFields[field] || field
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim()
    }

    return (
        <Card className="shadow-lg border-0">
            <CardHeader className="bg-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Database className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-slate-900">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className={cn(
                                "font-semibold text-slate-900",
                                isRTL ? "text-right" : "text-left"
                            )}>
                                {translations.name}
                            </TableHead>
                            <TableHead className="font-semibold text-slate-900 text-center">{translations.count}</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-center">{translations.percentage}</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-center">{translations.totalAmount}</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-center">{translations.avgVatRate}</TableHead>
                            <TableHead className="font-semibold text-slate-900 text-center">{translations.transactions}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <TableRow className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                                    <TableCell className={cn(
                                        "font-medium text-slate-900",
                                        isRTL ? "text-right" : "text-left"
                                    )}>
                                        <div className={cn(
                                            "flex items-center gap-2",
                                            isRTL ? "justify-start" : "justify-start"
                                        )}>
                                            <div className={`w-3 h-3 bg-gradient-to-br ${getItemColor(index)} rounded-full`}></div>
                                            <div className="flex flex-col space-y-1">
                                                <span className="font-medium text-slate-900">
                                                    {item.displayName}
                                                </span>
                                                {item.companyName && (
                                                    <span className="text-sm text-slate-500">
                                                        {item.companyName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-700 text-center">{item.count.toLocaleString()}</TableCell>
                                    <TableCell className="text-slate-700 text-center">{item.percentage.toFixed(1)}%</TableCell>
                                    <TableCell className="text-slate-700 text-right">
                                        {item.totalAmount !== undefined
                                            ? formatNIS(calculateTotalAmount(
                                                parsedData.transactions.filter(
                                                    (t: any) => t[identifierKey] === item.id
                                                )
                                            ))
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-slate-700 text-center">
                                        {item.avgPercentage !== undefined
                                            ? `${item.avgPercentage.toFixed(2)}%`
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-slate-700 text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "h-8 w-8 p-0 font-medium text-base transition-all duration-200",
                                                expanded[item.id]
                                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                            )}
                                            onClick={() => toggleExpand(item.id)}
                                            aria-label={expanded[item.id] ? translations.hideTransactions : translations.showTransactions}
                                        >
                                            {expanded[item.id] ? "−" : "+"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expanded[item.id] && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="bg-slate-100 p-4">
                                            <div className="overflow-x-auto max-h-64">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-8"></TableHead>
                                                            {Object.keys(
                                                                parsedData.transactions.find(
                                                                    (t: any) => t[identifierKey] === item.id
                                                                ) || {}
                                                            )
                                                                .filter(col => !excludeColumns.includes(col))
                                                                .map(col => (
                                                                    <TableHead key={col} className="font-semibold text-slate-900">
                                                                        {formatFieldName(col)}
                                                                    </TableHead>
                                                                ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {parsedData.transactions
                                                            .filter((t: any) => t[identifierKey] === item.id)
                                                            .map((transaction: any, txnIndex: number) => {
                                                                const sign = transaction.cancelOrCreditSign === "-" ? "-" : "+"
                                                                const isNegative = sign === "-"
                                                                const columns = Object.keys(transaction).filter(
                                                                    col => !excludeColumns.includes(col)
                                                                )
                                                                return (
                                                                    <TableRow
                                                                        key={txnIndex}
                                                                        className={`hover:bg-slate-50 ${isNegative ? "bg-red-100" : txnIndex % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                                                                            }`}
                                                                    >
                                                                        <TableCell
                                                                            className="font-bold text-lg text-center"
                                                                            style={{ color: isNegative ? "#b91c1c" : "#16a34a" }}
                                                                        >
                                                                            {sign}
                                                                        </TableCell>
                                                                        {columns.map((col, colIdx) => (
                                                                            <TableCell
                                                                                key={col}
                                                                                className={colIdx === 0 ? "font-medium text-slate-900" : "text-slate-700"}
                                                                            >
                                                                                {formatCellValue(transaction[col], col)}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                )
                                                            })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}