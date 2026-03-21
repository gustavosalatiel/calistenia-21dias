export default function BonusModal({ onClose }) {
  const pdfs = [
    {
      id: 'punos',
      icon: '🥊',
      title: 'PROTOCOLO DE PUÑOS DE ACERO',
      subtitle: 'Entrenamiento de fuerza de agarre',
      description: 'El protocolo secreto para desarrollar un agarre de acero y potencia explosiva en puños. Incluye ejercicios progresivos, series y técnica detallada.',
      pages: '24 páginas',
      filename: 'Protocolo-Punos-de-Acero.pdf',
      path: '/pdfs/Protocolo-Punos-de-Acero.pdf',
      color: '#6b2a2a',
      borderColor: 'rgba(220,38,38,0.3)',
    },
    {
      id: 'testosterona',
      icon: '⚡',
      title: 'GUÍA DEFINITIVA DE LOS',
      titleLine2: 'SABOTEADORES DE TESTOSTERONA',
      subtitle: 'Optimización hormonal masculina',
      description: 'Descubre los 12 saboteadores silenciosos que destruyen tu testosterona sin que lo sepas. Incluye plan de acción inmediato para optimizar tus niveles hormonales.',
      pages: '36 páginas',
      filename: 'Guia-Definitiva-de-los-Saboteadores-de-Testosterona.pdf',
      path: '/pdfs/Guia-Definitiva-de-los-Saboteadores-de-Testosterona.pdf',
      color: '#4B5E4B',
      borderColor: 'rgba(75,94,75,0.3)',
    },
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      backgroundColor: '#0F110F',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#151715',
        borderBottom: '1px solid #2A302A',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '2px',
          }}>
            MATERIALES CLASIFICADOS
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            color: '#8DA38D',
          }}>
            BONUS EXCLUSIVOS
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8DA38D',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>

        {/* Hero banner */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(75,94,75,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            color: '#ffffff',
            marginBottom: '4px',
          }}>
            DOCUMENTOS CLASIFICADOS
          </div>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#8DA38D',
            lineHeight: 1.5,
          }}>
            PDFs exclusivos del programa. Descarga tu material de formación táctica.
          </div>
        </div>

        {/* PDF Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              style={{
                backgroundColor: '#1A1D1A',
                border: `1px solid ${pdf.borderColor}`,
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Top accent bar */}
              <div style={{
                height: '3px',
                backgroundColor: pdf.color,
                opacity: 0.8,
              }} />

              <div style={{ padding: '16px' }}>
                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    backgroundColor: '#0F110F',
                    border: `1px solid ${pdf.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0,
                  }}>
                    {pdf.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: '"Black Ops One", cursive',
                      fontSize: '13px',
                      color: '#ffffff',
                      lineHeight: 1.3,
                      marginBottom: '2px',
                    }}>
                      {pdf.title}
                      {pdf.titleLine2 && (
                        <span style={{ display: 'block' }}>{pdf.titleLine2}</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '9px',
                      color: '#8DA38D',
                    }}>
                      {pdf.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '11px',
                  color: '#8DA38D',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                }}>
                  {pdf.description}
                </p>

                {/* Meta */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '9px',
                      color: '#4B5E4B',
                      backgroundColor: 'rgba(75,94,75,0.1)',
                      border: '1px solid rgba(75,94,75,0.3)',
                      padding: '2px 8px',
                      borderRadius: '3px',
                    }}>
                      📄 PDF
                    </span>
                    <span style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: '9px',
                      color: '#4B5E4B',
                    }}>
                      {pdf.pages}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: '#4B5E4B',
                  }}>
                    🔓 ACCESO LIBRE
                  </span>
                </div>

                {/* Download Button */}
                <a
                  href={pdf.path}
                  download={pdf.filename}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    backgroundColor: pdf.color,
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontFamily: '"Black Ops One", cursive',
                    fontSize: '13px',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    boxSizing: 'border-box',
                  }}
                >
                  ⬇ DESCARGAR PDF
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{
          backgroundColor: 'rgba(75,94,75,0.05)',
          border: '1px solid #2A302A',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <p style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4B5E4B',
            lineHeight: 1.5,
            margin: 0,
          }}>
            📌 Los PDFs se abrirán o descargarán directamente. Si los archivos no están disponibles, contacta al soporte del programa.
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px solid #2A302A',
            borderRadius: '6px',
            color: '#4B5E4B',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '12px',
            cursor: 'pointer',
            marginBottom: '32px',
          }}
        >
          ← VOLVER AL CUARTEL
        </button>

      </div>
    </div>
  )
}
