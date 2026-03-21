import { useState } from 'react'

const bodyTypes = ['Fit', 'Buff', 'Atlético', 'En forma']

export default function ProfileModal({ profile, userEmail, completedDays, onClose, onSave, onLogout }) {
  const [form, setForm] = useState({
    name: profile?.name || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    targetWeight: profile?.targetWeight || '',
    bodyType: profile?.bodyType || '',
  })
  const [saved, setSaved] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const progress = Math.round((completedDays.length / 21) * 100)

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
            EXPEDIENTE PERSONAL
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            color: '#8DA38D',
          }}>
            PERFIL DEL OPERATIVO
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

        {/* Avatar + Stats */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 80,
            height: 80,
            background: 'radial-gradient(circle, rgba(75,94,75,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#0F110F',
            border: '2px solid #4B5E4B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            flexShrink: 0,
          }}>
            🪖
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '18px',
              color: '#ffffff',
              marginBottom: '2px',
            }}>
              {form.name || 'OPERATIVO'}
            </div>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '10px',
              color: '#4B5E4B',
              marginBottom: '8px',
            }}>
              {userEmail}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '18px',
                  color: '#8DA38D',
                }}>
                  {completedDays.length}
                </div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '8px',
                  color: '#4B5E4B',
                }}>
                  DÍAS
                </div>
              </div>
              <div style={{ width: '1px', backgroundColor: '#2A302A' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '18px',
                  color: '#8DA38D',
                }}>
                  {progress}%
                </div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '8px',
                  color: '#4B5E4B',
                }}>
                  MISIÓN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '14px',
          }}>
            DATOS DEL OPERATIVO
          </div>

          {/* Name */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              NOMBRE / ALIAS
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre de operativo"
              style={{
                width: '100%',
                backgroundColor: '#0F110F',
                border: '1px solid #2A302A',
                borderRadius: '4px',
                padding: '10px 12px',
                color: '#e5e7eb',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '13px',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
              onBlur={(e) => e.target.style.borderColor = '#2A302A'}
            />
          </div>

          {/* Height + Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '8px',
                color: '#4B5E4B',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                ALTURA (CM)
              </label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm(prev => ({ ...prev, height: e.target.value }))}
                placeholder="ej: 175"
                style={{
                  width: '100%',
                  backgroundColor: '#0F110F',
                  border: '1px solid #2A302A',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: '#e5e7eb',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
                onBlur={(e) => e.target.style.borderColor = '#2A302A'}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '8px',
                color: '#4B5E4B',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                PESO (KG)
              </label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="ej: 80"
                style={{
                  width: '100%',
                  backgroundColor: '#0F110F',
                  border: '1px solid #2A302A',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: '#e5e7eb',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '13px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
                onBlur={(e) => e.target.style.borderColor = '#2A302A'}
              />
            </div>
          </div>

          {/* Target Weight */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              PESO OBJETIVO (KG)
            </label>
            <input
              type="number"
              value={form.targetWeight}
              onChange={(e) => setForm(prev => ({ ...prev, targetWeight: e.target.value }))}
              placeholder="ej: 72"
              style={{
                width: '100%',
                backgroundColor: '#0F110F',
                border: '1px solid #2A302A',
                borderRadius: '4px',
                padding: '10px 12px',
                color: '#e5e7eb',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '13px',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
              onBlur={(e) => e.target.style.borderColor = '#2A302A'}
            />
          </div>

          {/* Body Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              TIPO FÍSICO OBJETIVO
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {bodyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setForm(prev => ({ ...prev, bodyType: type }))}
                  style={{
                    padding: '10px',
                    backgroundColor: form.bodyType === type ? 'rgba(75,94,75,0.3)' : '#0F110F',
                    border: form.bodyType === type ? '1px solid #4B5E4B' : '1px solid #2A302A',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '11px',
                    color: form.bodyType === type ? '#8DA38D' : '#4B5E4B',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  {form.bodyType === type ? '◉' : '○'} {type}
                </button>
              ))}
            </div>
          </div>

          {saved && (
            <div style={{
              backgroundColor: 'rgba(75,94,75,0.2)',
              border: '1px solid #4B5E4B',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '10px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#8DA38D',
            }}>
              ✓ Perfil guardado correctamente
            </div>
          )}

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4B5E4B',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontFamily: '"Black Ops One", cursive',
              fontSize: '14px',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
          >
            GUARDAR PERFIL
          </button>
        </div>

        {/* Progress Overview */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '12px',
          }}>
            RESUMEN DE MISIÓN
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D' }}>
                Progreso total
              </span>
              <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#8DA38D' }}>
                {progress}%
              </span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#0F110F', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#4B5E4B',
                borderRadius: '3px',
                boxShadow: '0 0 6px rgba(75,94,75,0.5)',
              }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'COMPLETADOS', value: completedDays.length },
              { label: 'RESTANTES', value: 21 - completedDays.length },
              { label: 'TOTAL', value: 21 },
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                backgroundColor: '#0F110F',
                borderRadius: '6px',
                padding: '8px',
                border: '1px solid #2A302A',
              }}>
                <div style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '20px',
                  color: '#8DA38D',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '7px',
                  color: '#4B5E4B',
                  letterSpacing: '0.5px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '6px',
              color: '#f87171',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '12px',
              letterSpacing: '2px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            CERRAR SESIÓN
          </button>
        ) : (
          <div style={{
            backgroundColor: 'rgba(220,38,38,0.05)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#f87171',
              marginBottom: '12px',
            }}>
              ¿Confirmar cierre de sesión?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#1A1D1A',
                  border: '1px solid #2A302A',
                  borderRadius: '4px',
                  color: '#8DA38D',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                CANCELAR
              </button>
              <button
                onClick={onLogout}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'rgba(220,38,38,0.15)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: '4px',
                  color: '#f87171',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        )}

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
