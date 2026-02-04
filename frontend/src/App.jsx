import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import SpaceBackground from './SpaceBackground'

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
  const [loaderHidden, setLoaderHidden] = useState(false)
  const cursorRef = useRef(null)

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api'

  // Loading screen timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoaderHidden(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  // Cursor glow
  useEffect(() => {
    const handleMouse = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', handleMouse)
    return () => document.removeEventListener('mousemove', handleMouse)
  }, [])

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
    <>
      {/* Loading Screen */}
      <div className={`loader-overlay ${loaderHidden ? 'hidden' : ''}`}>
        <div className="loader-text">Initializing</div>
        <div className="loader-bar"><div className="loader-bar-fill"></div></div>
      </div>

      {/* Cursor Glow */}
      <div id="cursor-glow" ref={cursorRef}></div>

      {/* 3D Background */}
      <SpaceBackground />

      <div className="app">
        <div className="container">
          <header>
            {/* Darth Seldon DS Monogram Crest */}
            <svg className="imperial-crest" viewBox="0 0 100 120" fill="none">
              <defs>
                <linearGradient id="frameFill" x1="0" y1="0" x2="100" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4a4a4a"/>
                  <stop offset="50%" stopColor="#2a2a2a"/>
                  <stop offset="100%" stopColor="#3a3a3a"/>
                </linearGradient>
                <linearGradient id="letterFill" x1="0" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#5a5a5a"/>
                  <stop offset="50%" stopColor="#3a3a3a"/>
                  <stop offset="100%" stopColor="#4a4a4a"/>
                </linearGradient>
                <filter id="redGlow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Outer angular hexagonal frame — Sith holocron shape */}
              <path d="M50 2 L88 22 L88 98 L50 118 L12 98 L12 22 Z"
                    fill="url(#frameFill)" stroke="#555" strokeWidth="1.5"/>
              {/* Notched sides */}
              <path d="M12 45 L6 50 L6 70 L12 75" fill="none" stroke="#555" strokeWidth="1"/>
              <path d="M88 45 L94 50 L94 70 L88 75" fill="none" stroke="#555" strokeWidth="1"/>
              {/* Inner frame border */}
              <path d="M50 10 L82 27 L82 93 L50 110 L18 93 L18 27 Z"
                    fill="none" stroke="#444" strokeWidth="0.6"/>
              {/* "D" letter — left half, bold angular strokes */}
              <path d="M28 32 L28 88 L48 88 L48 82 L52 76 L52 44 L48 38 L48 32 Z
                       M36 42 L44 42 L46 46 L46 74 L44 78 L36 78 Z"
                    fill="url(#letterFill)" fillRule="evenodd" stroke="#555" strokeWidth="0.5"/>
              {/* "S" letter — right half, angular zigzag */}
              <path d="M54 32 L74 32 L74 40 L62 40 L58 46 L58 54 L74 54 L74 88 L54 88 L54 80 L66 80 L70 74 L70 66 L54 66 Z"
                    fill="url(#letterFill)" stroke="#555" strokeWidth="0.5"/>
              {/* Red lightsaber center line */}
              <line x1="50" y1="18" x2="50" y2="102" stroke="#ff1a1a" strokeWidth="2"
                    opacity="0.9" filter="url(#redGlow)"/>
              {/* Red glow accent — top point */}
              <circle cx="50" cy="5" r="3" fill="#ff1a1a" opacity="0.7" filter="url(#redGlow)"/>
              {/* Red glow accent — bottom point */}
              <circle cx="50" cy="115" r="3" fill="#ff1a1a" opacity="0.7" filter="url(#redGlow)"/>
            </svg>

            <h1>Darth <span className="accent">Seldon's</span> QR Forge</h1>
            <div className="saber-divider"></div>
            <p className="motto">"You don't know the power of the dark side"</p>
            <p>Command QR codes into existence for URLs and WiFi networks</p>
          </header>

          <div className="type-selector">
            <button
              className={qrType === 'url' ? 'active' : ''}
              onClick={() => { setQrType('url'); resetForm(); }}
            >
              URL
            </button>
            <button
              className={qrType === 'wifi' ? 'active' : ''}
              onClick={() => { setQrType('wifi'); resetForm(); }}
            >
              WiFi
            </button>
          </div>

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
                    type="password"
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
                {error}
              </div>
            )}

            <button type="submit" className="generate-btn" disabled={loading}>
              {loading ? 'Forging...' : 'Forge QR Code'}
            </button>
          </form>

          {qrImage && (
            <div className="qr-result">
              <h3>Your Power Manifest</h3>
              <div className="qr-image-container">
                <img src={qrImage} alt="Generated QR Code" />
              </div>
              <div className="qr-actions">
                <button onClick={downloadQR} className="download-btn">
                  Claim Power
                </button>
                <button onClick={resetForm} className="reset-btn">
                  Forge Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="app-footer">
          &copy; Darth Seldon &mdash; The Empire Endures
        </div>
      </div>
    </>
  )
}

export default App
