import { useState } from 'react'

export default function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      onLogin(email.trim())
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F110F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(75,94,75,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(75,94,75,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Top corner decorations */}
      <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderTop: '2px solid #4B5E4B', borderLeft: '2px solid #4B5E4B' }} />
      <div style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderTop: '2px solid #4B5E4B', borderRight: '2px solid #4B5E4B' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 40, height: 40, borderBottom: '2px solid #4B5E4B', borderLeft: '2px solid #4B5E4B' }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderBottom: '2px solid #4B5E4B', borderRight: '2px solid #4B5E4B' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo / Title Area */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {/* Military emblem */}
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            border: '2px solid #4B5E4B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1A1D1A',
            fontSize: '32px',
          }}>
            ⚔️
          </div>

          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4B5E4B',
            letterSpacing: '4px',
            marginBottom: '8px',
          }}>
            SISTEMA OPERATIVO TÁCTICO
          </div>

          <h1 style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '32px',
            color: '#8DA38D',
            lineHeight: 1.1,
            marginBottom: '4px',
            textShadow: '0 0 20px rgba(141,163,141,0.4)',
          }}>
            DESAFÍO
          </h1>
          <h1 style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '32px',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}>
            21 DÍAS
          </h1>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '13px',
            color: '#8DA38D',
            letterSpacing: '6px',
          }}>
            CALISTENIA MILITAR
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#2A302A' }} />
            <div style={{ width: 6, height: 6, backgroundColor: '#4B5E4B', transform: 'rotate(45deg)' }} />
            <div style={{ flex: 1, height: '1px', backgroundColor: '#2A302A' }} />
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '28px',
          marginBottom: '24px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ width: 8, height: 8, backgroundColor: '#4B5E4B', borderRadius: '50%' }} className="pulse-green" />
            ACCESO AL SISTEMA
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '10px',
                color: '#8DA38D',
                letterSpacing: '2px',
                marginBottom: '6px',
              }}>
                IDENTIFICADOR DE OPERATIVO
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operativo@email.com"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#0F110F',
                  border: '1px solid #2A302A',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  color: '#e5e7eb',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
                onBlur={(e) => e.target.style.borderColor = '#2A302A'}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(220,38,38,0.1)',
                border: '1px solid rgba(220,38,38,0.3)',
                borderRadius: '4px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '11px',
                color: '#f87171',
                letterSpacing: '1px',
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              style={{
                width: '100%',
                backgroundColor: loading ? '#2A302A' : '#4B5E4B',
                border: 'none',
                borderRadius: '4px',
                padding: '14px',
                color: loading ? '#8DA38D' : '#ffffff',
                fontFamily: '"Black Ops One", cursive',
                fontSize: '14px',
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => { if (!loading) e.target.style.backgroundColor = '#5a7060' }}
              onMouseLeave={(e) => { if (!loading) e.target.style.backgroundColor = '#4B5E4B' }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 14,
                    height: 14,
                    border: '2px solid #8DA38D',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  VERIFICANDO...
                </>
              ) : (
                'VERIFICAR ACCESO'
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div style={{
          border: '1px solid #2A302A',
          borderRadius: '4px',
          padding: '12px',
          backgroundColor: 'rgba(75,94,75,0.05)',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4B5E4B',
            letterSpacing: '1px',
            lineHeight: 1.6,
          }}>
            🔒 ACCESO RESTRINGIDO A OPERATIVOS AUTORIZADOS
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#2A302A',
          letterSpacing: '2px',
        }}>
          CONEXIÓN SEGURA | V.2.1.0
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
