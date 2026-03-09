import '@gravitate-js/excalibrr/dist/index.css'
import './styles.css'

import { ThemeContextProvider } from '@gravitate-js/excalibrr'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Main } from './_Main'
import { themeConfigs } from './components/shared/Theming/themeconfigs'
import { SharedDataProvider } from './shared/contexts/SharedDataContext'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
})

const responsiveFontConfig = {
  defaultFontSize: 14,
  breakpoints: [
    { maxWidth: 1440, fontSize: 10 },
    { maxWidth: 1960, fontSize: 11 },
  ],
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SharedDataProvider>
        <ThemeContextProvider themeConfigs={themeConfigs} responsiveFontConfig={responsiveFontConfig}>
          <Main />
        </ThemeContextProvider>
      </SharedDataProvider>
    </QueryClientProvider>
  )
}
