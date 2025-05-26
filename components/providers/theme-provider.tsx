'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="ghibli"
      enableSystem={false}
      themes={['ghibli', 'ghibli-dark', 'youtube', 'youtube-dark', 'professional', 'professional-dark', 'sunset', 'sunset-dark', 'ocean', 'ocean-dark']}
    >
      {children}
    </NextThemesProvider>
  )
}
