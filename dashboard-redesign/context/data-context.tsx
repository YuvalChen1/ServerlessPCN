"use client"

import { HeaderData } from "@/types/header-data";
import { createContext, useContext, useState, type ReactNode } from "react"
import { ParsedData } from "@/types/header-data"


// interface ParsedData {
//   header: HeaderData[];
//   transactions: Record<string, any>[]
//   footer: string
// }

interface DataContextType {
  parsedData: ParsedData | null
  setParsedData: (data: ParsedData | null) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)

  return <DataContext.Provider value={{ parsedData, setParsedData }}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
