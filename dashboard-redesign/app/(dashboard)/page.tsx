"use client"
import { useData } from "@/context/data-context"
import PCNUploader from "@/components/pcn-uploader"
import FileHeaderDashboard from "@/components/file-header-dashboard"
import { Card, CardContent } from "@/components/ui/card"


export default function HomePage() {
  const { parsedData } = useData()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">PCN File Processing Platform</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Transform your PCN files into actionable insights with our enterprise-grade processing engine.
        </p>
      </div>

      {!parsedData ? (
        <PCNUploader />
      ) : (
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <FileHeaderDashboard sampleHeaderData={Array.isArray(parsedData.header) ? parsedData.header : [parsedData.header]} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
