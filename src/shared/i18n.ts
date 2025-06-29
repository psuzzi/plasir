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
  scanSerial: string
  scanLot: string
  addNotes: string
  currentEntry: string
  noEntries: string
  startScanning: string
  
  // Table headers
  serialNumber: string
  lotNumber: string
  notes: string
  time: string
  actions: string
  deleteButton: string
  
  // Placeholders
  serialPlaceholder: string
  lotPlaceholder: string
  notesPlaceholder: string
  
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
    scanSerial: "Scansiona Numero Seriale Prodotto",
    scanLot: "Scansiona Numero Lotto",
    addNotes: "Aggiungi Note (Opzionale)",
    currentEntry: "Inserimento corrente:",
    noEntries: "Nessun prodotto inserito. Inizia a scansionare per aggiungere prodotti.",
    startScanning: "Inizia a scansionare per aggiungere prodotti",
    
    // Table headers
    serialNumber: "Numero Seriale",
    lotNumber: "Numero Lotto",
    notes: "Note",
    time: "Ora",
    actions: "Azioni",
    deleteButton: "Elimina",
    
    // Placeholders
    serialPlaceholder: "Numero seriale prodotto...",
    lotPlaceholder: "Numero di lotto...",
    notesPlaceholder: "Note...",
    
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
    scanSerial: "Scan Product Serial Number",
    scanLot: "Scan Lot Number",
    addNotes: "Add Notes (Optional)",
    currentEntry: "Current entry:",
    noEntries: "No entries yet. Start scanning to add products.",
    startScanning: "Start scanning to add products",
    
    // Table headers
    serialNumber: "Serial Number",
    lotNumber: "Lot Number",
    notes: "Notes",
    time: "Time",
    actions: "Actions",
    deleteButton: "Delete",
    
    // Placeholders
    serialPlaceholder: "Product serial number...",
    lotPlaceholder: "Lot number...",
    notesPlaceholder: "Notes...",
    
    // Language
    language: "Language",
    italian: "Italian",
    english: "English"
  }
}

export const getTranslation = (language: Language): Translations => {
  return translations[language] || translations.it // Default to Italian
} 