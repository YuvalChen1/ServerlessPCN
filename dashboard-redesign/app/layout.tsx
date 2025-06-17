import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataProvider } from "@/context/data-context"
import { LanguageProvider } from '@/context/language-context'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <DataProvider>{children}</DataProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
}
