import { createContext, useContext, useState } from 'react'

const DemoContext = createContext(null)

export function DemoProvider({ children }) {
  const [overrides, setOverrides] = useState({})
  return (
    <DemoContext.Provider value={{ overrides, setOverrides }}>
      {children}
    </DemoContext.Provider>
  )
}

export function useDemoConfig(config) {
  const ctx = useContext(DemoContext)
  if (!ctx) return config
  return {
    ...config,
    ...(ctx.overrides.name        && { name: ctx.overrides.name }),
    ...(ctx.overrides.accentColor && {
      accentColor: ctx.overrides.accentColor,
      primaryColor: ctx.overrides.accentColor,
      borderSubtle: ctx.overrides.accentColor + '33',
    }),
  }
}

export function useDemoControls() {
  const ctx = useContext(DemoContext)
  return ctx ? ctx.setOverrides : () => {}
}
