import React from 'react'
import { Outlet } from 'react-router-dom'

interface ThemeRouteWrapperProps {
  theme: string
  children?: React.ReactNode
}

export function ThemeRouteWrapper({ children }: ThemeRouteWrapperProps) {
  return children ? <>{children}</> : <Outlet />
}
