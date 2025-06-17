import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNIS } from "@/utils/formatNIS"
import { formatCellValue } from "@/utils/formatCellValue"

interface Transaction {
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
    TAXRATE?: string | number
}

interface RedFlagAnomaly {
    count: number
    transactions: Transaction[]
}

type RedFlagKey = 'unidentified' | 'standardRatedSales' | 'domesticPurchases'

interface RedFlagsSectionProps {
    unidentifiedCustomersAnomalies: RedFlagAnomaly
    standardRatedSalesTaxRateAnomalies: RedFlagAnomaly
    domesticPurchasesTaxRateAnomalies: RedFlagAnomaly
    showUnidentifiedCustomersFlag: boolean
    showStandardRatedSalesFlag: boolean
    showDomesticPurchasesFlag: boolean
    expandedAnomalies: Record<RedFlagKey, boolean>
    setExpandedAnomalies: React.Dispatch<React.SetStateAction<Record<RedFlagKey, boolean>>>
}

export function RedFlagsSection({
    unidentifiedCustomersAnomalies,
    standardRatedSalesTaxRateAnomalies,
    domesticPurchasesTaxRateAnomalies,
    showUnidentifiedCustomersFlag,
    showStandardRatedSalesFlag,
    showDomesticPurchasesFlag,
    expandedAnomalies,
    setExpandedAnomalies
}: RedFlagsSectionProps) {
    return (
        <Card className="shadow-lg border-0 mt-16 mb-8">
            <CardHeader className="bg-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-slate-900">Red Flags</CardTitle>
                        <CardDescription>Potential issues that require attention</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {showUnidentifiedCustomersFlag && (
                        <Card
                            className={cn(
                                "shadow-md border border-red-100 bg-white/50 hover:bg-white/80 transition-all duration-300",
                                expandedAnomalies["unidentified"] ? "md:col-span-3" : ""
                            )}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    Unidentified Customers Anomalies
                                </CardTitle>
                                <CardDescription>
                                    Transactions exceeding ₪5,000 with unidentified customers
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={cn(
                                "pt-0",
                                expandedAnomalies["unidentified"] ? "pb-0" : ""
                            )}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-bold text-red-600">
                                            {unidentifiedCustomersAnomalies.count}
                                        </p>
                                        <p className="text-sm text-slate-600">transactions found</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 w-8 p-0 font-medium text-base transition-all duration-200",
                                            expandedAnomalies["unidentified"]
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                        )}
                                        onClick={() => setExpandedAnomalies(prev => ({
                                            ...prev,
                                            unidentified: !prev.unidentified
                                        }))}
                                    >
                                        {expandedAnomalies["unidentified"] ? "−" : "+"}
                                    </Button>
                                </div>
                            </CardContent>
                            {expandedAnomalies["unidentified"] && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        {unidentifiedCustomersAnomalies.transactions.map((transaction: any, index: number) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg border border-red-100 p-4 hover:shadow-md transition-shadow duration-200"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 mb-3"
                                                >
                                                    {/* Different badge text based on anomaly type */}
                                                    {transaction.recordType === 'L' ? 'High Risk' : 'Invalid Tax Rate (18% ±0.05%)'}
                                                </Badge>

                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className={cn(
                                                            "text-lg font-bold truncate",
                                                            // Red text only for unidentified customers
                                                            transaction.recordType === 'L' ? "text-red-600" : "text-slate-900"
                                                        )}>
                                                            {formatNIS(transaction.invoiceAmount || transaction.InvoiceAmount)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Tax Rate</p>
                                                        <p className="text-sm text-slate-900 font-semibold">
                                                            {(transaction.taxRate || transaction.taxrate || transaction.TaxRate || transaction.TAXRATE || "N/A").toString()}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Date</p>
                                                        <p className="text-sm text-slate-900">
                                                            {formatCellValue(
                                                                transaction.invoiceDate || transaction.InvoiceDate || "N/A",
                                                                'invoiceDate'
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Reference #</p>
                                                        <p className="text-sm text-slate-900 truncate">
                                                            {transaction.reference || transaction.Reference || transaction.referenceNumber || transaction.ReferenceNumber || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Standard Rated Sales Tax Anomalies */}
                    {showStandardRatedSalesFlag && (
                        <Card
                            className={cn(
                                "shadow-md border border-red-100 bg-white/50 hover:bg-white/80 transition-all duration-300",
                                expandedAnomalies["standardRatedSales"] ? "md:col-span-3" : ""
                            )}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    Standard Rated Sales Tax Anomalies
                                </CardTitle>
                                <CardDescription>
                                    Transactions with tax rates outside 18% (±0.05%)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={cn(
                                "pt-0",
                                expandedAnomalies["standardRatedSales"] ? "pb-0" : ""
                            )}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-bold text-red-600">
                                            {standardRatedSalesTaxRateAnomalies.count}
                                        </p>
                                        <p className="text-sm text-slate-600">transactions found</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 w-8 p-0 font-medium text-base transition-all duration-200",
                                            expandedAnomalies["standardRatedSales"]
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                        )}
                                        onClick={() => setExpandedAnomalies(prev => ({
                                            ...prev,
                                            standardRatedSales: !prev.standardRatedSales
                                        }))}
                                    >
                                        {expandedAnomalies["standardRatedSales"] ? "−" : "+"}
                                    </Button>
                                </div>
                            </CardContent>
                            {expandedAnomalies["standardRatedSales"] && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        {standardRatedSalesTaxRateAnomalies.transactions.map((transaction: any, index: number) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg border border-red-100 p-4 hover:shadow-md transition-shadow duration-200"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 mb-3"
                                                >
                                                    {/* Different badge text based on anomaly type */}
                                                    {transaction.recordType === 'L' ? 'High Risk' : 'Invalid Tax Rate'}
                                                </Badge>

                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900 truncate">
                                                            {formatNIS(transaction.invoiceAmount || transaction.InvoiceAmount)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Tax Rate</p>
                                                        <p className="text-sm text-red-600 font-semibold">
                                                            {(transaction.taxRate || transaction.taxrate || transaction.TaxRate || transaction.TAXRATE || "N/A").toString()}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Date</p>
                                                        <p className="text-sm text-slate-900">
                                                            {formatCellValue(
                                                                transaction.invoiceDate || transaction.InvoiceDate || "N/A",
                                                                'invoiceDate'
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Reference #</p>
                                                        <p className="text-sm text-slate-900 truncate">
                                                            {transaction.reference || transaction.Reference || transaction.referenceNumber || transaction.ReferenceNumber || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Domestic Purchases Tax Anomalies */}
                    {showDomesticPurchasesFlag && (
                        <Card
                            className={cn(
                                "shadow-md border border-red-100 bg-white/50 hover:bg-white/80 transition-all duration-300",
                                expandedAnomalies["domesticPurchases"] ? "md:col-span-3" : ""
                            )}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-slate-900">
                                    Domestic Purchases Tax Anomalies
                                </CardTitle>
                                <CardDescription>
                                    Transactions with tax rates outside 18% (±0.05%)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={cn(
                                "pt-0",
                                expandedAnomalies["domesticPurchases"] ? "pb-0" : ""
                            )}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-bold text-red-600">
                                            {domesticPurchasesTaxRateAnomalies.count}
                                        </p>
                                        <p className="text-sm text-slate-600">transactions found</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 w-8 p-0 font-medium text-base transition-all duration-200",
                                            expandedAnomalies["domesticPurchases"]
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                        )}
                                        onClick={() => setExpandedAnomalies(prev => ({
                                            ...prev,
                                            domesticPurchases: !prev.domesticPurchases
                                        }))}
                                    >
                                        {expandedAnomalies["domesticPurchases"] ? "−" : "+"}
                                    </Button>
                                </div>
                            </CardContent>
                            {expandedAnomalies["domesticPurchases"] && (
                                <div className="px-6 pb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        {domesticPurchasesTaxRateAnomalies.transactions.map((transaction: any, index: number) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg border border-red-100 p-4 hover:shadow-md transition-shadow duration-200"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 mb-3"
                                                >
                                                    {/* Different badge text based on anomaly type */}
                                                    {transaction.recordType === 'L' ? 'High Risk' : 'Invalid Tax Rate (18% ±0.05%)'}
                                                </Badge>

                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="text-lg font-bold text-slate-900 truncate">
                                                            {formatNIS(transaction.invoiceAmount || transaction.InvoiceAmount)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-3">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Tax Rate</p>
                                                        <p className="text-sm text-red-600 font-semibold">
                                                            {(transaction.taxRate || transaction.taxrate || transaction.TaxRate || transaction.TAXRATE || "N/A").toString()}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Date</p>
                                                        <p className="text-sm text-slate-900">
                                                            {formatCellValue(
                                                                transaction.invoiceDate || transaction.InvoiceDate || "N/A",
                                                                'invoiceDate'
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-slate-600">Reference #</p>
                                                        <p className="text-sm text-slate-900 truncate">
                                                            {transaction.reference || transaction.Reference || transaction.referenceNumber || transaction.ReferenceNumber || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}