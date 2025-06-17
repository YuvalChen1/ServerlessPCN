"use client"

import type React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DataProvider, useData } from "@/context/data-context"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <DashboardContent>{children}</DashboardContent>
    </DataProvider>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { parsedData, setParsedData } = useData()

  return (
    <DashboardLayout parsedData={parsedData} setParsedData={setParsedData}>
      {children}
    </DashboardLayout>
  )
}
