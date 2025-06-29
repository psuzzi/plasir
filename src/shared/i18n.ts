export type Language = 'it' | 'en'

export interface Translations {
  // Setup screen
  setupTitle: string
  setupDescription: string
  selectDataFolder: string
  
  // Main screen
  appTitle: string
  dataFolder: string
  changeButton: string
  totalEntries: string
  autoSave: string
  saveNowButton: string
  saveSuccess: string
  
  // Scanner interface
  scanProductCode: string
  scanLot: string
  enterQuantity: string
  currentEntry: string
  noEntries: string
  startScanning: string
  
  // Table headers
  productCode: string
  lot: string
  quantity: string
  time: string
  actions: string
  deleteButton: string
  
  // Placeholders
  productCodePlaceholder: string
  lotPlaceholder: string
  quantityPlaceholder: string
  
  // Language
  language: string
  italian: string
  english: string
}

export const translations: Record<Language, Translations> = {
  it: {
    // Setup screen
    setupTitle: "Configurazione Scanner Prodotti",
    setupDescription: "Seleziona una cartella dove verranno salvati i file CSV.",
    selectDataFolder: "Seleziona Cartella Dati",
    
    // Main screen
    appTitle: "Scanner Prodotti",
    dataFolder: "Cartella dati:",
    changeButton: "Cambia",
    totalEntries: "Totale prodotti oggi:",
    autoSave: "Salvataggio automatico ogni 30 secondi",
    saveNowButton: "Salva Ora",
    saveSuccess: "Dati salvati con successo!",
    
    // Scanner interface
    scanProductCode: "Scansiona Codice Prodotto",
    scanLot: "Scansiona Lotto",
    enterQuantity: "Inserisci Quantità (Opzionale)",
    currentEntry: "Inserimento corrente:",
    noEntries: "Nessun prodotto inserito. Inizia a scansionare per aggiungere prodotti.",
    startScanning: "Inizia a scansionare per aggiungere prodotti",
    
    // Table headers
    productCode: "Codice Prodotto",
    lot: "Lotto",
    quantity: "Quantità",
    time: "Ora",
    actions: "Azioni",
    deleteButton: "Elimina",
    
    // Placeholders
    productCodePlaceholder: "Codice prodotto...",
    lotPlaceholder: "Lotto...",
    quantityPlaceholder: "Quantità...",
    
    // Language
    language: "Lingua",
    italian: "Italiano",
    english: "Inglese"
  },
  
  en: {
    // Setup screen
    setupTitle: "Product Scanner Setup",
    setupDescription: "Please select a folder where your CSV files will be saved.",
    selectDataFolder: "Select Data Folder",
    
    // Main screen
    appTitle: "Product Scanner",
    dataFolder: "Data folder:",
    changeButton: "Change",
    totalEntries: "Total entries today:",
    autoSave: "Auto-saves every 30 seconds",
    saveNowButton: "Save Now",
    saveSuccess: "Data saved successfully!",
    
    // Scanner interface
    scanProductCode: "Scan Product Code",
    scanLot: "Scan Lot",
    enterQuantity: "Enter Quantity (Optional)",
    currentEntry: "Current entry:",
    noEntries: "No entries yet. Start scanning to add products.",
    startScanning: "Start scanning to add products",
    
    // Table headers
    productCode: "Product Code",
    lot: "Lot",
    quantity: "Quantity",
    time: "Time",
    actions: "Actions",
    deleteButton: "Delete",
    
    // Placeholders
    productCodePlaceholder: "Product code...",
    lotPlaceholder: "Lot...",
    quantityPlaceholder: "Quantity...",
    
    // Language
    language: "Language",
    italian: "Italian",
    english: "English"
  }
}

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.it // Default to Italian
} 