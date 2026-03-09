import Color from 'color'
import dayjs from 'dayjs'

export type ThemeConfigDisplay = string

export interface ThemeConfig {
  display: string
  key: string
  isDark: boolean
  isActive?: boolean | (() => boolean)
  default?: boolean
  isFallback?: boolean

  colors: {
    info: string
    nav1: string
    nav2: string
    primary?: string
  }

  loginBackgroundImage?: string
  loginLogoImage?: string
  loginTransLogoImage?: string
}

export const themeConfigs: ThemeConfig[] = [
  {
    display: 'Light',
    key: 'LIGHT_MODE',
    isDark: false,
    isFallback: true,
    default: true,
    colors: {
      info: '#0C5A58',
      nav1: '#0C5A58',
      nav2: Color('#0C5A58').lighten(0.8).hex(),
      primary: '#51B073',
    },
  },
  {
    display: 'Dark',
    key: 'DARK_MODE',
    isDark: true,
    colors: {
      info: '#59cfff',
      nav1: '#19304B',
      nav2: Color('#19304B').lighten(0.8).hex(),
    },
  },
  {
    display: 'Sunoco',
    key: 'SUNOCO',
    isDark: false,
    colors: {
      info: '#F04B34',
      nav1: '#262F47',
      nav2: Color('#262F47').lighten(0.2).hex(),
    },
  },
  {
    display: 'FHR',
    key: 'FHR',
    isDark: false,
    colors: {
      info: '#908d71',
      nav1: '#2B2F35',
      nav2: Color('#2B2F35').lighten(0.2).hex(),
    },
  },
  {
    display: 'Murphy',
    key: 'MURPHY',
    isDark: false,
    colors: {
      info: '#c5c5c5',
      nav1: '#313131',
      nav2: Color('#313131').lighten(0.2).hex(),
    },
  },
  {
    display: 'Growmark',
    key: 'GROWMARK',
    isDark: false,
    colors: {
      info: Color('#000').lighten(0.4).hex(),
      nav1: '#000',
      nav2: Color('#000').lighten(0.4).hex(),
    },
  },
  {
    display: 'OSP',
    key: 'OSP',
    isDark: false,
    colors: {
      info: '#0F1121',
      nav1: '#0F1121',
      nav2: Color('#334e6d').lighten(0.8).hex(),
      primary: '#4BADE9',
    },
  },
  {
    display: 'BP',
    key: 'BP',
    isDark: false,
    colors: {
      info: '#74CDD7',
      nav1: '#007f00',
      nav2: Color('#007f00').lighten(0.2).hex(),
    },
  },
  {
    display: 'DKB',
    key: 'DKB',
    isDark: false,
    colors: {
      info: '#1d1d1d',
      nav1: '#000',
      nav2: Color('#000').lighten(0.3).hex(),
    },
  },
  {
    display: 'P66',
    key: 'P66',
    isDark: false,
    colors: {
      info: '#d60000',
      nav1: '#1e1e1e',
      nav2: Color('#1e1e1e').lighten(0.3).hex(),
    },
  },
  {
    display: 'PE Light',
    key: 'PE_LIGHT',
    isDark: false,
    colors: {
      info: '#0C5A58',
      nav1: '#0C5A58',
      nav2: Color('#0C5A58').lighten(0.8).hex(),
    },
  },
  {
    display: 'Motiva',
    key: 'MOTIVA',
    isDark: false,
    isActive: true,
    colors: {
      info: '#004b7f',
      nav1: '#081a2b',
      nav2: '#113b55',
    },
  },
  {
    display: 'Thanksgiving',
    key: 'THANKSGIVING',
    isDark: false,
    isActive: () => dayjs().month() + 1 === 11,
    colors: {
      info: '#cce5ff',
      nav1: '#532d08',
      nav2: '#5a2900',
    },
  },
  {
    display: 'Christmas',
    key: 'CHRISTMAS',
    isDark: false,
    isActive: () => dayjs().month() + 1 === 12,
    colors: {
      info: '#cce5ff',
      nav1: '#950d0d',
      nav2: '#b50c0c',
    },
  },
]
