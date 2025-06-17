"use client"

import { useData } from "@/context/data-context"
import VatFileNumberBreakdown from "@/components/vat-file-number-breakdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VatBreakdownPage() {
  const { parsedData } = useData()

  if (!parsedData) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">VAT File Number Breakdown</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Analyze the VAT file numbers and their distribution in your PCN file.
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>VAT File Number Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <VatFileNumberBreakdown parsedData={parsedData} />
        </CardContent>
      </Card>
    </div>
  )
}
