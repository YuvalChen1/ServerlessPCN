import {
    Database,
    TrendingUp,
    ArrowDownLeft,
    ArrowUpRight,
    Activity,
    ChevronLeft,
    ChevronRight,
    PieChart
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatNIS } from "@/utils/formatNIS"
import { RECORD_TYPE_MAPPING } from "@/utils/record-type-mapping"
import { useLanguage } from "@/context/language-context"

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

interface StatsCarouselProps {
    // Common props
    totalTransactions: number
    totalAmount: number
    totalItems: number

    // Specific to record type breakdown
    inputAmount?: number
    outputAmount?: number
    totalAllRecordsAmount?: number
    recordTypeStats?: Array<{
        recordType: string
        displayName: string
        count: number
        percentage: number
    }>
    recordTypeFilter?: string[]

    // Specific to VAT file breakdown
    mostCommonItem?: string
    topItemShare?: number
    itemType: 'recordType' | 'vatFile'

    // Carousel controls
    currentSlide: number
    setCurrentSlide: (value: number) => void

    translations: {
        totalTransactions: string
        totalAmount: string
        inputTurnover: string
        outputTurnover: string
        topTypeShare: string
        mostCommonType: string
        vatFileNumbers: string
        amountDue: string
        noData: string
        recordTypes?: {
            [key: string]: string
        }
    }
}

export function StatsCarousel({
    totalTransactions,
    totalAmount,
    inputAmount,
    outputAmount,
    totalAllRecordsAmount,
    recordTypeStats,
    recordTypeFilter,
    totalItems,
    mostCommonItem,
    topItemShare,
    itemType = 'recordType',
    currentSlide,
    setCurrentSlide,
    translations
}: StatsCarouselProps) {
    const { language } = useLanguage()
    const isRTL = language === 'he'

    // Fix the transform calculation
    const getSlideTransform = () => {
        if (isRTL) {
            // For RTL, slide in the opposite direction
            return {
                transform: `translateX(${currentSlide * 100}%)`
            }
        }
        // For LTR, keep original direction
        return {
            transform: `translateX(-${currentSlide * 100}%)`
        }
    }

    // Update the second slide content rendering
    const renderSecondSlide = () => (
        <div className="flex-shrink-0 w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
                {itemType === 'recordType' && (
                    <>
                        <Card className="shadow-lg border-0">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p
                                            className="text-lg font-bold text-slate-900 truncate max-w-[180px]"
                                            title={translations.recordTypes?.[recordTypeStats?.[0]?.recordType || ""]}
                                        >
                                            {recordTypeStats?.[0]?.recordType && translations.recordTypes?.[recordTypeStats[0].recordType]}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {translations.mostCommonType}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Add more second slide cards here */}
                    </>
                )}
            </div>
        </div>
    )

    return (
        <div className="relative mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={getSlideTransform()}
                >
                    {/* Keep slides in consistent order */}
                    <div className="flex-shrink-0 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
                            {/* Total Transactions Card */}
                            <Card className="shadow-lg border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <Database className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-slate-900">
                                                {totalTransactions.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-slate-600">{translations.totalTransactions}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Amount Card */}
                            <Card className="shadow-lg border-0">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                                                {itemType === 'vatFile' ? (
                                                    <PieChart className="h-6 w-6 text-white" />
                                                ) : (
                                                    <TrendingUp className="h-6 w-6 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {itemType === 'vatFile' ? (
                                                <>
                                                    <p className="text-2xl font-bold text-slate-900">
                                                        {totalItems}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{translations.vatFileNumbers}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-lg font-bold text-slate-900 break-words">
                                                        {formatNIS(totalAmount)}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{translations.amountDue}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Conditional Cards based on itemType */}
                            {itemType === 'recordType' ? (
                                // Record Type specific cards
                                <>
                                    {/* Input/Output Cards */}
                                    {(!recordTypeFilter || recordTypeFilter.some(t => ['T', 'C', 'K', 'R', 'P', 'H'].includes(t))) && (
                                        <>
                                            {/* Input Turnover Card */}
                                            <Card className="shadow-lg border-0">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                                            <ArrowDownLeft className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-2xl font-bold text-slate-900">
                                                                {((inputAmount! / totalAllRecordsAmount!) * 100).toFixed(1)}%
                                                            </p>
                                                            <p className="text-sm text-slate-600">{translations.inputTurnover}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Only show Top Type Share for Input when in input view */}
                                            {recordTypeFilter?.includes('T') && (
                                                <Card className="shadow-lg border-0">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                                                <Activity className="h-6 w-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-2xl font-bold text-slate-900">
                                                                    {recordTypeStats?.[0]?.percentage.toFixed(1)}%
                                                                </p>
                                                                <p className="text-sm text-slate-600">{translations.topTypeShare}</p>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {recordTypeStats?.[0]?.recordType && RECORD_TYPE_MAPPING[recordTypeStats[0].recordType]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </>
                                    )}

                                    {/* Similar structure for Output */}
                                    {(!recordTypeFilter || recordTypeFilter.some(t => ['S', 'L', 'M', 'Y', 'I'].includes(t))) && (
                                        <>
                                            {/* Output Turnover Card */}
                                            <Card className="shadow-lg border-0">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                                                            <ArrowUpRight className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-2xl font-bold text-slate-900">
                                                                {((outputAmount! / totalAllRecordsAmount!) * 100).toFixed(1)}%
                                                            </p>
                                                            <p className="text-sm text-slate-600">{translations.outputTurnover}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Only show Top Type Share for Output when in output view */}
                                            {recordTypeFilter?.includes('S') && (
                                                <Card className="shadow-lg border-0">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                                                <Activity className="h-6 w-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-2xl font-bold text-slate-900">
                                                                    {recordTypeStats?.[0]?.percentage.toFixed(1)}%
                                                                </p>
                                                                <p className="text-sm text-slate-600">{translations.topTypeShare}</p>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {recordTypeStats?.[0]?.recordType && RECORD_TYPE_MAPPING[recordTypeStats[0].recordType]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                // VAT File specific cards
                                <>
                                    <Card className="shadow-lg border-0">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                                    <TrendingUp className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-slate-900">
                                                        {mostCommonItem || "N/A"}
                                                    </p>
                                                    <p className="text-sm text-slate-600">{translations.mostCommonType}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="shadow-lg border-0">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                                                    <Activity className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-bold text-slate-900">
                                                        {topItemShare?.toFixed(1)}%
                                                    </p>
                                                    <p className="text-sm text-slate-600">{translations.topTypeShare}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Second Slide */}
                    {renderSecondSlide()}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-2">
                <button
                    className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}
                    onClick={() => setCurrentSlide(0)}
                />
                <button
                    className={`w-2 h-2 rounded-full transition-colors ${currentSlide === 1 ? 'bg-blue-600' : 'bg-slate-300'}`}
                    onClick={() => setCurrentSlide(1)}
                />
            </div>

            {/* Arrow Navigation */}
            <button
                className={`${carouselStyles.arrowButton} ${isRTL ? '-right-16' : '-left-16'} group`}
                onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)}
                aria-label={isRTL ? "הבא" : "Previous"}
            >
                {isRTL ? <ChevronRight className={carouselStyles.arrowIcon} /> : <ChevronLeft className={carouselStyles.arrowIcon} />}
            </button>
            <button
                className={`${carouselStyles.arrowButton} ${isRTL ? '-left-16' : '-right-16'} group`}
                onClick={() => setCurrentSlide(currentSlide === 0 ? 1 : 0)}
                aria-label={isRTL ? "הקודם" : "Next"}
            >
                {isRTL ? <ChevronLeft className={carouselStyles.arrowIcon} /> : <ChevronRight className={carouselStyles.arrowIcon} />}
            </button>
        </div>
    )
}