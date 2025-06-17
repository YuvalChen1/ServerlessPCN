"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js"
import { graphTranslations } from "@/translations/graphTranslations"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TaxGraphProps {
    headers: Array<{
        reportDate: string
        totalTaxableAmount: string
        vatOnTaxable: string
        otherRateDealsAmount: string
        otherRateVat: string
    }>
    formatDate: (date: string) => string
    formatCurrency: (value: string) => string
    language: "en" | "he" // ✅ Add language prop
}

export default function TaxGraph({ headers, formatDate, formatCurrency, language }: TaxGraphProps) {
    const t = graphTranslations[language] // ✅ Get translations for current language

    const sortedHeaders = [...headers].sort((a, b) =>
        a.reportDate.localeCompare(b.reportDate)
    )

    const labels = sortedHeaders.map(header => formatDate(header.reportDate))

    const data = {
        labels,
        datasets: [
            {
                label: t.outputTax,
                data: sortedHeaders.map(header => {
                    const vatOnTaxable = Number(header.vatOnTaxable.replace(/[^\d.-]/g, ""))
                    const otherRateVat = Number(header.otherRateVat.replace(/[^\d.-]/g, ""))
                    return vatOnTaxable + otherRateVat
                }),
                borderColor: "rgb(59, 130, 246)", // blue
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.3,
                fill: true
            },
            {
                label: t.inputTax,
                data: sortedHeaders.map(header =>
                    Number(header.otherRateVat.replace(/[^\d.-]/g, ""))
                ),
                borderColor: "rgb(234, 88, 12)", // orange
                backgroundColor: "rgba(234, 88, 12, 0.1)",
                tension: 0.3,
                fill: true
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index" as const,
            intersect: false
        },
        plugins: {
            legend: {
                position: "top" as const
            },
            tooltip: {
                rtl: language === "he", // ✅ Make tooltips RTL in Hebrew
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || ""
                        if (label) label += ": "
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y.toString())
                        }
                        return label
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        return formatCurrency(value.toString())
                    }
                }
            }
        }
    }

    return (
        <Card className={`shadow-lg border-0 ${language === "he" ? "direction-rtl" : ""}`}>
            <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="text-slate-900">{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div style={{ height: "400px" }}>
                    <Line data={data} options={options} />
                </div>
            </CardContent>
        </Card>
    )
}
