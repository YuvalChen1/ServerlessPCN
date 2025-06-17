"use client"

import { useData } from "@/context/data-context"
import RecordTypeBreakdown from "@/components/record-type-breakdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecordTypesPage() {
  const { parsedData } = useData()

  if (!parsedData) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Record Type Breakdown</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Analyze the distribution of different record types in your PCN file.
        </p>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Record Type Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <RecordTypeBreakdown parsedData={parsedData} />
        </CardContent>
      </Card>
    </div>
  )
}
