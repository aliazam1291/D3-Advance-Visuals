'use client'
import { createContext, useContext, useState } from 'react'

const LayoutContext = createContext({
  collapsed: false,
  toggle: () => {},
})

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <LayoutContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((v) => !v) }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => useContext(LayoutContext)
