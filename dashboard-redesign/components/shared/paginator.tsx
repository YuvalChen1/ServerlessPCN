import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"

interface PaginatorProps {
    currentPage: number
    totalPages: number
    totalItems: number
    startIndex: number
    endIndex: number
    onPreviousPage: () => void
    onNextPage: () => void
    itemName?: string
    translations?: {
        showing: string
        to: string
        of: string
        page: string
        previous: string
        next: string,
    }
}

export function Paginator({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPreviousPage,
    onNextPage,
    itemName = "items",
    translations
}: PaginatorProps) {
    const { language } = useLanguage()
    const isRTL = language === 'he'

    return (
        <div className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row"
        )}>
            <div className={cn(
                "flex-1 text-sm text-slate-600",
                isRTL && "text-right"
            )}>
                <span dir={isRTL ? 'rtl' : 'ltr'}>
                    {translations?.showing} {startIndex + 1} {translations?.to} {Math.min(endIndex, totalItems)} {translations?.of} {totalItems} {itemName}
                </span>
            </div>
            <div className={cn(
                "flex items-center gap-2",
                isRTL && "flex-row-reverse"
            )}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={isRTL ? onNextPage : onPreviousPage}
                    disabled={isRTL ? currentPage === totalPages : currentPage === 1}
                    className="h-8 px-3"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-600" dir={isRTL ? 'rtl' : 'ltr'}>
                    {translations?.page} {currentPage} {translations?.of} {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={isRTL ? onPreviousPage : onNextPage}
                    disabled={isRTL ? currentPage === 1 : currentPage === totalPages}
                    className="h-8 px-3"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}