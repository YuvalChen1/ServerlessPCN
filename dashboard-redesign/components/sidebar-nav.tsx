"use client"

import { cn } from "@/lib/utils"
import { BarChart3, FileText, PieChart, Database } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarNavProps {
  hasData: boolean
}

export function SidebarNav({ hasData }: SidebarNavProps) {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <Database className="h-5 w-5" />,
      disabled: !hasData,
    },
    {
      title: "Record Types",
      href: "/record-types",
      icon: <PieChart className="h-5 w-5" />,
      disabled: !hasData,
    },
    {
      title: "VAT Breakdown",
      href: "/vat-breakdown",
      icon: <BarChart3 className="h-5 w-5" />,
      disabled: !hasData,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <FileText className="h-5 w-5" />,
      disabled: !hasData,
    },
  ]

  return (
    <nav className="flex flex-col space-y-1 w-full">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
            pathname === item.href
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            item.disabled && "pointer-events-none opacity-50",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              pathname === item.href ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600",
            )}
          >
            {item.icon}
          </div>
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
