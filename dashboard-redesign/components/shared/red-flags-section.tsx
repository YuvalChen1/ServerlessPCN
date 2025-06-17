import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle } from "lucide-react"  // Add CheckCircle here
import { cn } from "@/lib/utils"
import { formatNIS } from "@/utils/formatNIS"
import { formatCellValue } from "@/utils/formatCellValue"
import type { RedFlagType, RedFlagAnomaly, RedFlagsSectionProps } from '@/types/red-flags'
import { useLanguage } from "@/context/language-context" // Changed from @/hooks/useLanguage


// Update the AnomalyCardProps interface
interface AnomalyCardProps {
    anomaly: RedFlagAnomaly
    isExpanded: boolean
    onToggle: () => void
    anomalyKey: RedFlagType
    translations: {
        title: string
        description: string
        transactionDetails: {
            recordType: string
            taxRate: string
            date: string
            referenceNumber: string
            transactionsFound: string
        }
    } & {
        [key in RedFlagType]: {
            title: string
            description: string
            [key: string]: string
        }
    }
}

function AnomalyCard({
    anomaly,
    isExpanded,
    onToggle,
    anomalyKey,
    translations
}: AnomalyCardProps) {
    const { language } = useLanguage()
    const isRTL = language === 'he'

    const getTitle = () => {
        return translations[anomalyKey]?.title || ''
    }

    return (
        <Card
            className={cn(
                "shadow-md border border-red-100 bg-white/50 hover:bg-white/80 transition-all duration-300",
                isExpanded ? "md:col-span-3" : ""
            )}
        >
            <CardHeader className="pb-3" dir={isRTL ? 'rtl' : 'ltr'}>
                <CardTitle className="text-lg font-semibold text-slate-900">
                    {getTitle()}
                </CardTitle>
                <CardDescription>{anomaly.description}</CardDescription>
            </CardHeader>
            <CardContent className={cn("pt-0", isExpanded ? "pb-0" : "")}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold text-red-600">{anomaly.count}</p>
                        <p className="text-sm text-slate-600">
                            {translations.transactionDetails.transactionsFound}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 w-8 p-0 font-medium text-base transition-all duration-200",
                            isExpanded
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                        )}
                        onClick={onToggle}
                    >
                        {isExpanded ? "−" : "+"}
                    </Button>
                </div>
            </CardContent>
            {isExpanded && (
                <div className="px-6 pb-6" dir={isRTL ? 'rtl' : 'ltr'}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {anomaly.transactions.map((transaction, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg border border-red-100 p-4 hover:shadow-md transition-shadow duration-200"
                            >
                                <Badge
                                    variant="secondary"
                                    className="bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200 mb-3"
                                >
                                    {transaction.recordType === 'L'
                                        ? translations.unidentified.highRisk
                                        : translations.standardRatedSales.invalidTaxRate}
                                </Badge>

                                {/* Amount section - keep as is */}
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className={cn(
                                            "text-lg font-bold truncate",
                                            anomalyKey === 'unidentified' && transaction.recordType === 'L'
                                                ? "text-red-600"
                                                : "text-slate-900"
                                        )}>
                                            {formatNIS(
                                                typeof (transaction.invoiceAmount ?? transaction.InvoiceAmount) === "number"
                                                    ? (transaction.invoiceAmount ?? transaction.InvoiceAmount) as number
                                                    : Number(transaction.invoiceAmount ?? transaction.InvoiceAmount) || 0
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Update transaction details section */}
                                <div className="space-y-2 mt-3">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-600">
                                            {translations.transactionDetails.recordType}
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {transaction.recordType || transaction.RecordType || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-600">
                                            {translations.transactionDetails.taxRate}
                                        </p>
                                        <p className={cn(
                                            "text-sm font-semibold",
                                            anomalyKey !== 'unidentified' ? "text-red-600" : "text-slate-900"
                                        )}>
                                            {(transaction.taxRate || transaction.taxrate || transaction.TaxRate || "N/A").toString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-600">
                                            {translations.transactionDetails.date}
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {formatCellValue(
                                                transaction.invoiceDate || transaction.InvoiceDate || "N/A",
                                                'invoiceDate'
                                            )}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-600">
                                            {translations.transactionDetails.referenceNumber}
                                        </p>
                                        <p className="text-sm text-slate-900 truncate">
                                            {transaction.reference || transaction.Reference ||
                                                transaction.referenceNumber || transaction.ReferenceNumber || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    )
}

export function RedFlagsSection({
    anomalies,
    visibleFlags,
    expandedAnomalies,
    setExpandedAnomalies,
    noFlagsMessage,
    translations
}: RedFlagsSectionProps) {
    const { language } = useLanguage()
    const isRTL = language === 'he'

    const toggleAnomaly = (flag: RedFlagType) => {
        setExpandedAnomalies({
            ...expandedAnomalies,
            [flag]: !expandedAnomalies[flag]
        })
    }

    const hasActiveFlags = visibleFlags.length > 0

    // Update the no flags return statement
    if (!hasActiveFlags) {
        return (
            <Card className="shadow-lg border-0 mt-16 mb-8">
                <CardHeader
                    className={cn(
                        "bg-white border-b border-slate-200",
                        isRTL && "text-right"
                    )}
                    dir={isRTL ? 'rtl' : 'ltr'}
                >
                    <div className={cn(
                        "flex items-center gap-3 w-full",
                        isRTL ? "flex-row justify-start" : "flex-row justify-start"
                    )}>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                            <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-slate-900">{translations.title}</CardTitle>
                            <CardDescription>{noFlagsMessage}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="shadow-lg border-0 mt-16 mb-8">
            <CardHeader
                className={cn(
                    "bg-white border-b border-slate-200",
                    isRTL && "text-right"
                )}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <div className={cn(
                    "flex items-center gap-3 w-full",
                    isRTL ? "flex-row justify-end" : "flex-row justify-start" // Fixed RTL/LTR positioning
                )}>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-slate-900">{translations.title}</CardTitle>
                        <CardDescription>{translations.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleFlags.map(flag => (
                        <AnomalyCard
                            key={flag}
                            anomaly={anomalies[flag]}
                            isExpanded={expandedAnomalies[flag]}
                            onToggle={() => toggleAnomaly(flag)}
                            anomalyKey={flag}
                            translations={{
                                ...translations,
                                unidentified: {
                                    ...translations.unidentified,
                                    title: (translations.unidentified as any)?.title ?? "",
                                    description: (translations.unidentified as any)?.description ?? ""
                                },
                                standardRatedSales: {
                                    ...translations.standardRatedSales,
                                    title: (translations.standardRatedSales as any)?.title ?? "",
                                    description: (translations.standardRatedSales as any)?.description ?? ""
                                },
                                domesticPurchases: {
                                    ...translations.domesticPurchases,
                                    title: (translations.domesticPurchases as any)?.title ?? "",
                                    description: (translations.domesticPurchases as any)?.description ?? ""
                                },
                                inputTaxAnomaly: {
                                    ...((translations as any).inputTaxAnomaly ?? {}),
                                    title: (translations as any).inputTaxAnomaly?.title ?? "",
                                    description: (translations as any).inputTaxAnomaly?.description ?? ""
                                },
                                outputTaxAnomaly: {
                                    ...((translations as any).outputTaxAnomaly ?? {}),
                                    title: (translations as any).outputTaxAnomaly?.title ?? "",
                                    description: (translations as any).outputTaxAnomaly?.description ?? ""
                                }
                            }}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}