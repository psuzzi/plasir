import React, { useState, useEffect, useRef } from 'react'
import { ProductEntry } from '../shared/types'

const App: React.FC = () => {
  const [entries, setEntries] = useState<ProductEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState({ serial: '', lot: '', notes: '' })
  const [currentField, setCurrentField] = useState<'serial' | 'lot' | 'notes'>('serial')
  const [isConfigured, setIsConfigured] = useState(false)
  const [dataFolder, setDataFolder] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

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
      if (result.success && result.config?.dataFolder) {
        setDataFolder(result.config.dataFolder)
        setIsConfigured(true)
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
            const [serial, lot, notes, timestamp] = line.split(',').map(field => 
              field.replace(/^"|"$/g, '').replace(/""/g, '"')
            )
            return {
              id: `entry-${index}`,
              serial: serial || '',
              lot: lot || '',
              notes: notes || '',
              timestamp: timestamp || new Date().toISOString()
            }
          }).filter(entry => entry.serial || entry.lot || entry.notes)
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
        await window.electronAPI.saveConfig({ dataFolder: folder })
        setDataFolder(folder)
        setIsConfigured(true)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const saveCsv = async () => {
    try {
      const csvContent = [
        'Serial,Lot,Notes,Timestamp',
        ...entries.map(entry => 
          `"${entry.serial}","${entry.lot}","${entry.notes}","${entry.timestamp}"`
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
      
      if (currentField === 'serial' && currentEntry.serial) {
        setCurrentField('lot')
      } else if (currentField === 'lot' && currentEntry.lot) {
        // Complete the entry and move to next row
        const newEntry: ProductEntry = {
          id: `entry-${Date.now()}`,
          serial: currentEntry.serial,
          lot: currentEntry.lot,
          notes: currentEntry.notes,
          timestamp: new Date().toISOString()
        }
        
        setEntries(prev => [...prev, newEntry])
        setCurrentEntry({ serial: '', lot: '', notes: '' })
        setCurrentField('serial')
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
        <h1 style={{ marginBottom: '20px' }}>Product Scanner Setup</h1>
        <p style={{ marginBottom: '20px', textAlign: 'center' }}>
          Please select a folder where your CSV files will be saved.
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
          Select Data Folder
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Product Scanner - {new Date().toLocaleDateString()}</h1>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Data folder: {dataFolder}
          <button 
            onClick={selectDataFolder}
            style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '12px' }}
          >
            Change
          </button>
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
        <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}>
          {currentField === 'serial' ? 'Scan Product Serial Number' : 
           currentField === 'lot' ? 'Scan Lot Number' : 'Add Notes (Optional)'}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={currentEntry[currentField]}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            currentField === 'serial' ? 'Product serial number...' :
            currentField === 'lot' ? 'Lot number...' : 'Notes...'
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
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Current entry: Serial: "{currentEntry.serial}" | Lot: "{currentEntry.lot}" | Notes: "{currentEntry.notes}"
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Serial Number</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Lot Number</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Notes</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Time</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={entry.serial}
                    onChange={(e) => updateEntry(index, 'serial', e.target.value)}
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
                    value={entry.notes}
                    onChange={(e) => updateEntry(index, 'notes', e.target.value)}
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
                    Delete
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
            No entries yet. Start scanning to add products.
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
        Total entries today: {entries.length} | File: {getTodaysFilename()} | Auto-saves every 30 seconds
      </div>
    </div>
  )
}

export default App 