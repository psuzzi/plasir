import React, { useState, useEffect, useRef } from 'react'
import { ProductEntry, AppConfig } from '../shared/types'
import { Language, getTranslation } from '../shared/i18n'

const App: React.FC = () => {
  const [entries, setEntries] = useState<ProductEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState({ productCode: '', lot: '', quantity: '' })
  const [currentField, setCurrentField] = useState<'productCode' | 'lot' | 'quantity'>('productCode')
  const [isConfigured, setIsConfigured] = useState(false)
  const [dataFolder, setDataFolder] = useState('')
  const [language, setLanguage] = useState<Language>('it') // Default to Italian
  const [saveMessage, setSaveMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const t = getTranslation(language)

  // Get today's filename
  const getTodaysFilename = () => {
    const today = new Date().toISOString().split('T')[0]
    return `products-${today}.csv`
  }

  // Load configuration and today's data
  useEffect(() => {
    loadConfig()
    loadTodaysData()
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (entries.length > 0) {
        saveCsv()
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [entries])

  const loadConfig = async () => {
    try {
      const result = await window.electronAPI.loadConfig()
      if (result.success && result.config) {
        if (result.config.dataFolder) {
          setDataFolder(result.config.dataFolder)
          setIsConfigured(true)
        }
        if (result.config.language) {
          setLanguage(result.config.language)
        }
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const loadTodaysData = async () => {
    try {
      const filename = getTodaysFilename()
      const result = await window.electronAPI.loadCsv(filename)
      if (result.success && result.content) {
        const lines = result.content.trim().split('\n')
        if (lines.length > 1) { // Skip header
          const loadedEntries = lines.slice(1).map((line, index) => {
            const [productCode, lot, quantity, timestamp] = line.split(',').map(field => 
              field.replace(/^"|"$/g, '').replace(/""/g, '"')
            )
            return {
              id: `entry-${index}`,
              productCode: productCode || '',
              lot: lot || '',
              quantity: quantity || '',
              timestamp: timestamp || new Date().toISOString()
            }
          }).filter(entry => entry.productCode || entry.lot || entry.quantity)
          setEntries(loadedEntries)
        }
      }
    } catch (error) {
      console.error('Failed to load today\'s data:', error)
    }
  }

  const selectDataFolder = async () => {
    try {
      const folder = await window.electronAPI.selectFolder()
      if (folder) {
        const config: AppConfig = { dataFolder: folder, language }
        await window.electronAPI.saveConfig(config)
        setDataFolder(folder)
        setIsConfigured(true)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const changeLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage)
    const config: AppConfig = { dataFolder, language: newLanguage }
    try {
      await window.electronAPI.saveConfig(config)
    } catch (error) {
      console.error('Failed to save language preference:', error)
    }
  }

  const saveNow = async () => {
    try {
      await saveCsv()
      setSaveMessage(t.saveSuccess)
      setTimeout(() => setSaveMessage(''), 3000) // Clear message after 3 seconds
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const saveCsv = async () => {
    try {
      const csvContent = [
        'ProductCode,Lot,Quantity,Timestamp',
        ...entries.map(entry => 
          `"${entry.productCode}","${entry.lot}","${entry.quantity}","${entry.timestamp}"`
        )
      ].join('\n')
      
      await window.electronAPI.saveCsv(csvContent, getTodaysFilename())
    } catch (error) {
      console.error('Failed to save CSV:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      if (currentField === 'productCode' && currentEntry.productCode) {
        setCurrentField('lot')
      } else if (currentField === 'lot' && currentEntry.lot) {
        setCurrentField('quantity')
      } else if (currentField === 'quantity') {
        // Complete the entry and move to next row (quantity can be empty)
        const newEntry: ProductEntry = {
          id: `entry-${Date.now()}`,
          productCode: currentEntry.productCode,
          lot: currentEntry.lot,
          quantity: currentEntry.quantity,
          timestamp: new Date().toISOString()
        }
        
        setEntries(prev => [...prev, newEntry])
        setCurrentEntry({ productCode: '', lot: '', quantity: '' })
        setCurrentField('productCode')
        saveCsv()
      }
    }
  }

  const handleInputChange = (value: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      [currentField]: value
    }))
  }

  const updateEntry = (index: number, field: keyof ProductEntry, value: string) => {
    setEntries(prev => prev.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ))
    saveCsv()
  }

  const deleteEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index))
    saveCsv()
  }

  if (!isConfigured) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        padding: '20px' 
      }}>
        {/* Language selector at top */}
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value as Language)}
            style={{ padding: '8px', fontSize: '14px' }}
          >
            <option value="it">{getTranslation('it').italian}</option>
            <option value="en">{getTranslation('en').english}</option>
          </select>
        </div>
        
        <h1 style={{ marginBottom: '20px' }}>{t.setupTitle}</h1>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>
          {t.setupDescription}
        </p>
        <button 
          onClick={selectDataFolder}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {t.selectDataFolder}
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t.appTitle} - {new Date().toLocaleDateString()}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Language selector */}
          <div>
            <select 
              value={language} 
              onChange={(e) => changeLanguage(e.target.value as Language)}
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              <option value="it">{t.italian}</option>
              <option value="en">{t.english}</option>
            </select>
          </div>
          {/* Data folder info */}
          <div style={{ fontSize: '14px', color: '#666' }}>
            {t.dataFolder} {dataFolder}
            <button 
              onClick={selectDataFolder}
              style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px' }}
            >
              {t.changeButton}
            </button>
          </div>
        </div>
      </div>

      {/* Current input area */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #007AFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {currentField === 'productCode' ? t.scanProductCode : 
             currentField === 'lot' ? t.scanLot : t.enterQuantity}
          </div>
          <button 
            onClick={saveNow}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t.saveNowButton}
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={currentEntry[currentField]}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            currentField === 'productCode' ? t.productCodePlaceholder :
            currentField === 'lot' ? t.lotPlaceholder : t.quantityPlaceholder
          }
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '6px'
          }}
          autoFocus
        />
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666', display: 'flex', justifyContent: 'space-between' }}>
          <span>{t.currentEntry} Codice: "{currentEntry.productCode}" | Lotto: "{currentEntry.lot}" | Quantità: "{currentEntry.quantity}"</span>
          {saveMessage && <span style={{ color: '#28a745', fontWeight: 'bold' }}>{saveMessage}</span>}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                      <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{t.productCode}</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{t.lot}</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{t.quantity}</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{t.time}</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>{t.actions}</th>
              </tr>
            </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={entry.productCode}
                    onChange={(e) => updateEntry(index, 'productCode', e.target.value)}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={entry.lot}
                    onChange={(e) => updateEntry(index, 'lot', e.target.value)}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={entry.quantity}
                    onChange={(e) => updateEntry(index, 'quantity', e.target.value)}
                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontSize: '12px' }}>
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => deleteEntry(index)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {t.deleteButton}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {entries.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            backgroundColor: 'white'
          }}>
            {t.noEntries}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#666'
      }}>
        {t.totalEntries} {entries.length} | File: {getTodaysFilename()} | {t.autoSave}
      </div>
    </div>
  )
}

export default App 