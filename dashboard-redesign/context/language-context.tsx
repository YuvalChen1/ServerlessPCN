"use client"

import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'he'
type Direction = 'ltr' | 'rtl'

interface LanguageContextType {
  language: Language
  direction: Direction
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [direction, setDirection] = useState<Direction>('ltr')

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'he' : 'en'
      setDirection(newLang === 'he' ? 'rtl' : 'ltr')
      return newLang
    })
  }

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      <div dir={direction}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}