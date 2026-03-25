import { useEffect } from 'react'

export function useTheme(theme: string) {
  useEffect(() => {
    const previous = localStorage.getItem('TYPE_OF_THEME')
    localStorage.setItem('TYPE_OF_THEME', theme)
    window.dispatchEvent(new Event('storage'))

    return () => {
      if (previous) {
        localStorage.setItem('TYPE_OF_THEME', previous)
      }
      window.dispatchEvent(new Event('storage'))
    }
  }, [theme])
}
