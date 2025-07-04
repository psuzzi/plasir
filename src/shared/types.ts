export interface ProductEntry {
  id: string
  productCode: string
  lot: string
  quantity: string
  timestamp: string
}

export interface AppConfig {
  dataFolder?: string
  language?: 'it' | 'en'
}

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>
      saveCsv: (csvContent: string, filename: string) => Promise<{ success: boolean; path?: string; error?: string }>
      loadCsv: (filename: string) => Promise<{ success: boolean; content?: string; error?: string }>
      saveConfig: (config: AppConfig) => Promise<{ success: boolean; error?: string }>
      loadConfig: () => Promise<{ success: boolean; config?: AppConfig; error?: string }>
    }
  }
} 