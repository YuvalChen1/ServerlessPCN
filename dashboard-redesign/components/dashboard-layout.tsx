"use client"

import type React from "react"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, CheckCircle } from "lucide-react"
import { SidebarNav } from "./sidebar-nav"
import { useRouter, usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  parsedData: any | null
  setParsedData: (data: any) => void
}

export function DashboardLayout({ children, parsedData, setParsedData }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const hasData = !!parsedData

  // Redirect to home if no data and trying to access other pages
  useEffect(() => {
    if (!hasData && pathname !== "/") {
      router.push("/")
    }
  }, [hasData, pathname, router])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">DataFlow</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Enterprise Ready
              </Badge>
              <Button variant="outline" size="sm">
                Documentation
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4">
          <SidebarNav hasData={hasData} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  )
}
