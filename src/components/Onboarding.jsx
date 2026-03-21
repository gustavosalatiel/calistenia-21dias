import { useState, useEffect, useRef } from 'react'

const BODY_TYPES = [
  {
    id: 'MUSCULAR',
    label: 'MUSCULAR',
    desc: 'Alto enfoque en hipertrofia',
    color: '#8DA38D',
  },
  {
    id: 'ATLÉTICO',
    label: 'ATLÉTICO',
    desc: 'Resistencia y fuerza equilibrada',
    color: '#4B5E4B',
  },
  {
    id: 'POTENCIA',
    label: 'POTENCIA',
    desc: 'Salida de fuerza máxima',
    color: '#8DA38D',
  },
  {
    id: 'ÁGIL',
    label: 'ÁGIL',
    desc: 'Alta movilidad y definición',
    color: '#8DA38D',
  },
]

function SliderDisplay({ value, unit, min, max, onChange }) {
  return (
    <div style={{ width: '100%' }}>
      {/* Big value display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <span style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '72px',
          color: '#ffffff',
          lineHeight: 1,
        }}>
          {value}
        </span>
        <sup style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '22px',
          color: '#4B5E4B',
          marginLeft: '6px',
          verticalAlign: 'super',
        }}>
          {unit}
        </sup>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '8px' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            height: '4px',
            borderRadius: '2px',
            background: `linear-gradient(to right, #4B5E4B ${((value - min) / (max - min)) * 100}%, #2A302A ${((value - min) / (max - min)) * 100}%)`,
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Min/max labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '9px',
        color: '#4B5E4B',
        letterSpacing: '1px',
      }}>
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  )
}

function ProgressBar({ step }) {
  const pct = ((step + 1) / 5) * 100
  return (
    <div style={{
      width: '100%',
      height: '3px',
      backgroundColor: '#2A302A',
      borderRadius: '2px',
      marginBottom: '24px',
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        backgroundColor: '#4B5E4B',
        borderRadius: '2px',
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

function StepHeader({ step }) {
  return (
    <div style={{
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '10px',
      color: '#4B5E4B',
      letterSpacing: '2px',
      textAlign: 'right',
      marginBottom: '4px',
    }}>
      PASO {step + 1} // 05
    </div>
  )
}

function NavButtons({ onBack, onNext, nextLabel = 'CONFIRMAR →', showBack = true }) {
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      marginTop: '24px',
    }}>
      {showBack && (
        <button
          onClick={onBack}
          style={{
            flex: '0 0 48px',
            height: '48px',
            backgroundColor: 'transparent',
            border: '1px solid #2A302A',
            borderRadius: '8px',
            color: '#8DA38D',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
      )}
      <button
        onClick={onNext}
        style={{
          flex: 1,
          height: '48px',
          backgroundColor: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          color: '#0F110F',
          fontFamily: '"Black Ops One", cursive',
          fontSize: '14px',
          letterSpacing: '2px',
          cursor: 'pointer',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

function LoadingScreen({ formData, onComplete }) {
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const getStatusText = (pct) => {
    if (pct < 20) return `ANALIZANDO PERFIL DE ${formData.name.toUpperCase()}...`
    if (pct < 40) return 'PROCESANDO DATOS BIOMÉTRICOS...'
    if (pct < 55) return 'PROCESANDO ALGORITMO...'
    if (pct < 70) return `ADAPTANDO CARGAS PARA ${formData.weight}KG...`
    if (pct < 85) return 'MONTANDO RUTINA DIARIA DE ELITE...'
    return 'AJUSTANDO PROTOCOLOS DE RECUPERACIÓN...'
  }

  const getBarLabel = (pct) => {
    if (pct < 33) return 'RECOPILANDO DATOS...'
    if (pct < 66) return 'PROCESANDO ALGORITMO...'
    return 'FINALIZANDO...'
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current)
          return 100
        }
        return prev + 1
      })
    }, 350)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete(formData)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [progress, formData, onComplete])

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0F110F',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '"Share Tech Mono", monospace',
    }}>
      {/* Warning banner */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#92400e',
        padding: '10px 16px',
        textAlign: 'center',
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '11px',
        color: '#fef3c7',
        letterSpacing: '1px',
        zIndex: 10,
        borderBottom: '1px solid #b45309',
      }}>
        ⚠ NO SALGAS DE ESTA PANTALLA — ESPERA A QUE TERMINE
      </div>

      <div style={{ width: '100%', maxWidth: '420px', marginTop: '48px' }}>
        {/* Circular progress */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          position: 'relative',
        }}>
          <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="#2A302A"
              strokeWidth="6"
            />
            <circle
              cx="65"
              cy="65"
              r="54"
              fill="none"
              stroke="#4B5E4B"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', lineHeight: 1 }}>🧠</div>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '20px',
              color: '#ffffff',
              lineHeight: 1.1,
            }}>
              {progress}%
            </div>
          </div>
        </div>

        {/* Status text */}
        <div style={{
          textAlign: 'center',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '12px',
          color: '#8DA38D',
          letterSpacing: '1px',
          marginBottom: '8px',
          minHeight: '20px',
        }}>
          {getStatusText(progress)}
        </div>

        {/* Animated dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px',
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4B5E4B',
                animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px' }}>INICIO DE SISTEMA</span>
            <span style={{ fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px' }}>OPTIMIZACIÓN</span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: '#2A302A',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#4B5E4B',
              borderRadius: '2px',
              transition: 'width 0.35s ease',
            }} />
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#8DA38D',
            letterSpacing: '1px',
          }}>
            {getBarLabel(progress)}
          </div>
        </div>

        {/* 3 icon cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { icon: '📊', label: 'METABOLISMO' },
            { icon: '📋', label: 'HISTORIAL' },
            { icon: '🎯', label: 'OBJETIVOS' },
          ].map((card) => (
            <div key={card.label} style={{
              backgroundColor: '#1A1D1A',
              border: '1px solid #2A302A',
              borderRadius: '8px',
              padding: '12px 8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '8px',
                color: '#4B5E4B',
                letterSpacing: '1px',
              }}>
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [showLoading, setShowLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    height: 175,
    weight: 75,
    targetWeight: 70,
    bodyType: 'ATLÉTICO',
  })

  const handleNext = () => {
    if (step === 4) {
      setShowLoading(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1))
  }

  if (showLoading) {
    return <LoadingScreen formData={formData} onComplete={onComplete} />
  }

  const cardStyle = {
    backgroundColor: '#1A1D1A',
    border: '1px solid #2A302A',
    borderRadius: '12px',
    padding: '28px 24px',
    width: '100%',
    maxWidth: '480px',
  }

  const iconStyle = {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '16px',
  }

  const titleStyle = {
    fontFamily: '"Black Ops One", cursive',
    fontSize: '24px',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '6px',
    letterSpacing: '1px',
  }

  const subtitleStyle = {
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '11px',
    color: '#4B5E4B',
    letterSpacing: '2px',
    textAlign: 'center',
    marginBottom: '28px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F110F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={cardStyle}>
        {/* Step counter top-right */}
        <StepHeader step={step} />

        {/* Progress bar */}
        <ProgressBar step={step} />

        {/* STEP 0 — IDENTIFICACIÓN */}
        {step === 0 && (
          <>
            <div style={iconStyle}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
                <circle cx="12" cy="8" r="4" stroke="#8DA38D" strokeWidth="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#8DA38D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div style={titleStyle}>IDENTIFICACIÓN</div>
            <div style={subtitleStyle}>COMO PODEMOS TE CHAMAR RECLUTA?</div>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value.toUpperCase() }))}
              placeholder="SEU NOME"
              autoFocus
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '2px solid #4B5E4B',
                outline: 'none',
                padding: '12px 0',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '18px',
                color: '#ffffff',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                marginBottom: '8px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#2A302A',
              textAlign: 'center',
              marginBottom: '0',
              letterSpacing: '1px',
            }}>
              {formData.name.length > 0 ? '✓ RECLUTA IDENTIFICADO' : 'AGUARDANDO IDENTIFICAÇÃO...'}
            </div>

            <NavButtons
              onNext={handleNext}
              showBack={false}
              nextLabel="CONFIRMAR →"
            />
          </>
        )}

        {/* STEP 1 — BIOMETRÍA: ALTURA */}
        {step === 1 && (
          <>
            <div style={iconStyle}>📏</div>
            <div style={titleStyle}>BIOMETRÍA: ALTURA</div>
            <div style={subtitleStyle}>CALIBRAR PARÁMETROS VERTICALES</div>
            <SliderDisplay
              value={formData.height}
              unit="CM"
              min={140}
              max={220}
              onChange={(v) => setFormData((d) => ({ ...d, height: v }))}
            />
            <NavButtons onBack={handleBack} onNext={handleNext} />
          </>
        )}

        {/* STEP 2 — BIOMETRÍA: CARGA ACTUAL */}
        {step === 2 && (
          <>
            <div style={iconStyle}>🏋️</div>
            <div style={titleStyle}>BIOMETRÍA: CARGA ACTUAL</div>
            <div style={subtitleStyle}>INGRESE MASA CORPORAL ACTUAL</div>
            <SliderDisplay
              value={formData.weight}
              unit="KG"
              min={40}
              max={150}
              onChange={(v) => setFormData((d) => ({ ...d, weight: v }))}
            />
            <NavButtons onBack={handleBack} onNext={handleNext} />
          </>
        )}

        {/* STEP 3 — OBJETIVO: CARGA META */}
        {step === 3 && (
          <>
            <div style={iconStyle}>🎯</div>
            <div style={titleStyle}>OBJETIVO: CARGA META</div>
            <div style={subtitleStyle}>ESTABLECER META OPERATIVA</div>
            <SliderDisplay
              value={formData.targetWeight}
              unit="KG"
              min={40}
              max={150}
              onChange={(v) => setFormData((d) => ({ ...d, targetWeight: v }))}
            />
            <NavButtons onBack={handleBack} onNext={handleNext} />
          </>
        )}

        {/* STEP 4 — CLASIFICACIÓN */}
        {step === 4 && (
          <>
            <div style={iconStyle}>🛡️</div>
            <div style={titleStyle}>CLASIFICACIÓN</div>
            <div style={subtitleStyle}>SELECCIONAR TIPO DE OPERADOR</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
              {BODY_TYPES.map((bt) => {
                const selected = formData.bodyType === bt.id
                return (
                  <button
                    key={bt.id}
                    onClick={() => setFormData((d) => ({ ...d, bodyType: bt.id }))}
                    style={{
                      backgroundColor: selected ? 'rgba(75,94,75,0.15)' : '#0F110F',
                      border: `1px solid ${selected ? '#4B5E4B' : '#2A302A'}`,
                      borderLeft: `4px solid ${selected ? '#4B5E4B' : '#2A302A'}`,
                      borderRadius: '8px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{
                        fontFamily: '"Black Ops One", cursive',
                        fontSize: '14px',
                        color: selected ? '#ffffff' : '#8DA38D',
                        marginBottom: '2px',
                        letterSpacing: '1px',
                      }}>
                        {bt.label}
                      </div>
                      <div style={{
                        fontFamily: '"Share Tech Mono", monospace',
                        fontSize: '10px',
                        color: selected ? '#8DA38D' : '#4B5E4B',
                        letterSpacing: '1px',
                      }}>
                        {bt.desc}
                      </div>
                    </div>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: `2px solid ${selected ? '#4B5E4B' : '#2A302A'}`,
                      backgroundColor: selected ? '#4B5E4B' : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {selected && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                        }} />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <NavButtons onBack={handleBack} onNext={handleNext} nextLabel="INICIALIZAR →" />
          </>
        )}
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #4B5E4B;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(75,94,75,0.6);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #4B5E4B;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(75,94,75,0.6);
        }
      `}</style>
    </div>
  )
}
