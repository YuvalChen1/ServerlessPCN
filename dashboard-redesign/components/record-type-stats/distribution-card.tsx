import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, FileText } from "lucide-react"
import { Crown as CrownIcon } from "lucide-react"
import { formatNIS } from "@/utils/formatNIS"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

interface DistributionItemProps {
  id: string
  displayName: string
  companyName?: string // Add this
  subText?: string
  count: number
  percentage: number
  totalAmount?: number
  avgPercentage?: number
}

interface DistributionCardProps {
  title: string
  description: string
  items: DistributionItemProps[]
  getItemColor: (index: number) => string
  getBadgeColor: (index: number) => string
  icon?: React.ReactNode
  totalAmount: number // Add this
  translations: {
    transactions: string
    average: string
  }
  startIndex?: number
}

export function DistributionCard({
  title,
  description,
  items,
  getItemColor,
  getBadgeColor,
  icon = <BarChart3 className="h-5 w-5 text-white" />,
  translations,
  startIndex
}: DistributionCardProps) {
  const { language } = useLanguage()
  const isRTL = language === 'he'

  return (
    <Card className="shadow-lg border-0 mb-8">
      <CardHeader className={cn(
        "bg-white border-b border-slate-200",
        isRTL && "text-right"
      )}>
        <div dir={isRTL ? 'rtl' : 'ltr'} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center shadow-sm">
            {icon}
          </div>
          <div>
            <CardTitle className="text-slate-900">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
          {items.map((item, index) => {
            const absoluteIndex = (startIndex ?? 0) + index
            return (
              <div key={item.id} className="space-y-3">
                <div className="flex items-center justify-between w-full">
                  {/* Name section with icon */}
                  <div className="flex items-center gap-3 flex-1">
                    {isRTL ? (
                      <>
                        <div className={`w-8 h-8 bg-gradient-to-br ${getItemColor(index)} rounded-lg flex items-center justify-center shadow-sm`}>
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col space-y-1">
                            <div className="font-medium text-slate-900">
                              {item.displayName}
                            </div>
                            {item.companyName && (
                              <div className="text-sm text-slate-500">
                                {item.companyName}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {item.count.toLocaleString()} {translations.transactions} ({item.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`w-8 h-8 bg-gradient-to-br ${getItemColor(index)} rounded-lg flex items-center justify-center shadow-sm`}>
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col space-y-1">
                            <div className="font-medium text-slate-900">
                              {item.displayName}
                            </div>
                            {item.companyName && (
                              <div className="text-sm text-slate-500">
                                {item.companyName}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">
                            {item.count.toLocaleString()} {translations.transactions} ({item.percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Amount and badge section */}
                  <div className={cn(
                    "flex items-center gap-3 shrink-0",
                    isRTL && "flex-row" // Only reverse in RTL
                  )}>
                    {item.totalAmount !== undefined && (
                      <div className={isRTL ? "text-left" : "text-right"}>
                        <p className="font-semibold text-slate-900">
                          {formatNIS(item.totalAmount)}
                        </p>
                        {item.avgPercentage !== undefined && (
                          <p className="text-sm text-slate-600">
                            {translations.average}: {item.avgPercentage.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}%
                          </p>
                        )}
                      </div>
                    )}
                    <Badge
                      className={cn(
                        "flex items-center gap-1",
                        index <= 2 ? "bg-slate-100 text-slate-800" : getBadgeColor(index)
                      )}
                    >
                      {absoluteIndex === 0 && <CrownIcon className="w-4 h-4 text-yellow-500" />}
                      {absoluteIndex === 1 && <CrownIcon className="w-4 h-4 text-gray-400" />}
                      {absoluteIndex === 2 && <CrownIcon className="w-4 h-4 text-amber-700" />}
                      {absoluteIndex > 2 && absoluteIndex + 1}
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={item.percentage}
                  className={cn("h-2", getItemColor(index))}
                  style={isRTL ? { transform: "scaleX(-1)", transformOrigin: "center" } : {}}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}