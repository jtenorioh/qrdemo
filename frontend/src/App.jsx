import React, { useState } from 'react'
import './App.css'

function App() {
  const [qrType, setQrType] = useState('url')
  const [url, setUrl] = useState('')
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [encryptionType, setEncryptionType] = useState('WPA')
  const [hidden, setHidden] = useState(false)
  const [qrImage, setQrImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'

  const generateQR = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setQrImage(null)

    try {
      let endpoint = ''
      let body = {}

      if (qrType === 'url') {
        if (!url.trim()) {
          setError('Please enter a URL')
          setLoading(false)
          return
        }
        endpoint = `${apiBaseUrl}/qr/url`
        body = { url: url.trim() }
      } else {
        if (!ssid.trim() || !password.trim()) {
          setError('Please enter both SSID and password')
          setLoading(false)
          return
        }
        endpoint = `${apiBaseUrl}/qr/wifi`
        body = {
          ssid: ssid.trim(),
          password: password.trim(),
          encryptionType,
          hidden
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setQrImage(imageUrl)
    } catch (err) {
      setError(err.message || 'Failed to generate QR code')
      console.error('Error generating QR code:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrImage) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = `qr-code-${qrType}-${Date.now()}.png`
    link.click()
  }

  const resetForm = () => {
    setUrl('')
    setSsid('')
    setPassword('')
    setEncryptionType('WPA')
    setHidden(false)
    setQrImage(null)
    setError(null)
  }

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>⚡ QR Code Generator</h1>
          <p>Generate QR codes for URLs and WiFi credentials</p>
        </header>

        <div className="type-selector">
          <button
            className={qrType === 'url' ? 'active' : ''}
            onClick={() => { setQrType('url'); resetForm(); }}
          >
            🔗 URL
          </button>
          <button
            className={qrType === 'wifi' ? 'active' : ''}
            onClick={() => { setQrType('wifi'); resetForm(); }}
          >
            📶 WiFi
          </button>
        </div>

        <div className="form-card">
          <form onSubmit={generateQR}>
            {qrType === 'url' ? (
              <div className="form-group">
                <label htmlFor="url">Enter URL</label>
                <input
                  type="text"
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="ssid">WiFi Network Name (SSID)</label>
                  <input
                    type="text"
                    id="ssid"
                    placeholder="MyWiFiNetwork"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    id="password"
                    placeholder="Enter WiFi password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="encryption">Encryption Type</label>
                    <select
                      id="encryption"
                      value={encryptionType}
                      onChange={(e) => setEncryptionType(e.target.value)}
                      disabled={loading}
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={hidden}
                        onChange={(e) => setHidden(e.target.checked)}
                        disabled={loading}
                      />
                      <span>Hidden Network</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="generate-btn" disabled={loading}>
              {loading && <span className="spinner-inline"></span>}
              <span>{loading ? 'Generating...' : '✨ Generate QR Code'}</span>
            </button>
          </form>
        </div>

        {qrImage && (
          <div className="qr-result">
            <h3>Your QR Code</h3>
            <div className="qr-image-container">
              <img src={qrImage} alt="Generated QR Code" />
            </div>
            <div className="qr-actions">
              <button onClick={downloadQR} className="download-btn">
                <span>💾</span>
                <span>Download</span>
              </button>
              <button onClick={resetForm} className="reset-btn">
                <span>🔄</span>
                <span>Generate Another</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
