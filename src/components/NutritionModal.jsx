import { useState } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL = 'gemini-2.5-flash-lite'

function UpsellScreen({ onClose }) {
  const features = [
    'Acelera tu metabolismo x3 con plan científico',
    'Elimina grasa visceral con alimentación estratégica',
    'Plan 100% personalizado por IA según tu cuerpo',
    'Macros calculados para máxima ganancia muscular',
    'Recetas tácticas para preparación semanal',
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
        <div style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '16px',
          color: '#8DA38D',
        }}>
          NUTRICIÓN DE COMBATE
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

      <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>
        {/* Hero */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '20px',
          textAlign: 'center',
          padding: '32px 20px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 30%, rgba(75,94,75,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}>
            MÓDULO BLOQUEADO
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '22px',
            color: '#ffffff',
            marginBottom: '4px',
            lineHeight: 1.2,
          }}>
            AL PARECER NO OBTUVISTE
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '22px',
            color: '#8DA38D',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            ESTE MÓDULO
          </div>
          <p style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '12px',
            color: '#8DA38D',
            lineHeight: 1.5,
          }}>
            El Módulo de Nutrición de Combate es la herramienta de IA más poderosa para acelerar tus resultados.
          </p>
        </div>

        {/* Features */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '12px',
          }}>
            LO QUE INCLUYE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.map((feat, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#4B5E4B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#fff',
                  flexShrink: 0,
                  marginTop: '1px',
                }}>
                  ✓
                </div>
                <span style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '12px',
                  color: '#8DA38D',
                  lineHeight: 1.4,
                }}>
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#4B5E4B',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '16px',
            letterSpacing: '2px',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
          onClick={() => window.open('https://wa.me/', '_blank')}
        >
          OBTENER ACCESO AHORA →
        </button>

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
          }}
        >
          ← VOLVER AL CUARTEL
        </button>
      </div>
    </div>
  )
}

// Supplement cards data
const SUPPLEMENTS = [
  {
    id: 'batido',
    icon: '⚡',
    title: 'BATIDO DE PÓLVORA',
    subtitle: 'VASCULARIZACIÓN PRE-COMBATE',
    desc: 'Mezcla explosiva de 3 ingredientes para máxima vascularización.',
    detail: 'Licuado de remolacha (200ml) + jugo de zanahoria (100ml) + jengibre rallado (1cm). Tomar 30-45 min antes del entrenamiento.',
  },
  {
    id: 'nocturna',
    icon: '🌙',
    title: 'RACIÓN NOCTURNA',
    subtitle: 'TESTOSTERONA Y RECUPERACIÓN',
    desc: 'Protocolo nocturno para optimizar hormonas y quema de grasa.',
    detail: '200g carne roja magra o 3 huevos + ½ aguacate + 100g camote cocido. Consumir 1-2h antes de dormir.',
  },
  {
    id: 'clandestinos',
    icon: '🛡️',
    title: 'ALIMENTOS CLANDESTINOS',
    subtitle: 'SECRETOS DE FUERZAS ESPECIALES',
    desc: 'Lista de alimentos baratos y densos que la industria ignora.',
    detail: 'Hígado de res • Sardinas enlatadas • Huevo entero • Lentejas • Semillas de calabaza • Avena integral • Ajo crudo • Cúrcuma',
  },
]

function SupplementCard({ card }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      backgroundColor: '#1A1D1A',
      border: '1px solid #2A302A',
      borderRadius: '10px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
    }}
      onClick={() => setExpanded((e) => !e)}
    >
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: '28px', marginBottom: '10px' }}>{card.icon}</div>
        <div style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '13px',
          color: '#ffffff',
          letterSpacing: '1px',
          marginBottom: '3px',
        }}>
          {card.title}
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '9px',
          color: '#4B5E4B',
          letterSpacing: '1px',
          marginBottom: '8px',
        }}>
          {card.subtitle}
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '11px',
          color: '#8DA38D',
          lineHeight: 1.5,
          marginBottom: '12px',
        }}>
          {card.desc}
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '9px',
          color: '#4B5E4B',
          letterSpacing: '1px',
          borderTop: '1px solid #2A302A',
          paddingTop: '10px',
        }}>
          CLICK PARA ACCEDER ›
        </div>
      </div>

      {expanded && (
        <div style={{
          backgroundColor: '#0F110F',
          borderTop: '1px solid #2A302A',
          padding: '14px 16px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#8DA38D',
            lineHeight: 1.6,
          }}>
            {card.detail}
          </div>
        </div>
      )}
    </div>
  )
}

function StatsCards({ data }) {
  const stats = [
    { label: 'CALORÍAS DIARIAS', value: data.calorias, unit: 'kcal' },
    { label: 'PROTEÍNA OBJETIVO', value: `${data.proteina}g`, unit: '' },
    { label: 'TASA METABÓLICA', value: Math.round(data.tmb), unit: 'kcal/reposo' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '12px 10px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            color: '#ffffff',
            marginBottom: '4px',
            lineHeight: 1,
          }}>
            {s.value}
          </div>
          {s.unit && (
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              {s.unit}
            </div>
          )}
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '7px',
            color: '#4B5E4B',
            letterSpacing: '1px',
          }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function MealSection({ mealKey, mealLabel, options }) {
  const [tab, setTab] = useState(0)
  const option = options[tab]

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Meal header */}
      <div style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '9px',
        color: '#4B5E4B',
        letterSpacing: '2px',
        marginBottom: '8px',
      }}>
        {mealLabel}
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '10px',
      }}>
        {options.map((_, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: tab === i ? '#4B5E4B' : '#1A1D1A',
              border: `1px solid ${tab === i ? '#4B5E4B' : '#2A302A'}`,
              borderRadius: '4px',
              color: tab === i ? '#ffffff' : '#8DA38D',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              letterSpacing: '1px',
              cursor: 'pointer',
            }}
          >
            OPCIÓN {i + 1}
          </button>
        ))}
      </div>

      {/* Meal card */}
      <div style={{
        backgroundColor: '#1A1D1A',
        border: '1px solid #2A302A',
        borderRadius: '8px',
        padding: '14px',
      }}>
        <div style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '13px',
          color: '#ffffff',
          marginBottom: '4px',
          letterSpacing: '1px',
        }}>
          {option.nombre}
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#8DA38D',
          marginBottom: '10px',
        }}>
          {option.descripcion}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {option.ingredientes.map((ing, idx) => (
            <span key={idx} style={{
              backgroundColor: '#0F110F',
              border: '1px solid #2A302A',
              borderRadius: '4px',
              padding: '3px 8px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#8DA38D',
            }}>
              {ing}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function StructuredPlan({ data }) {
  const meals = [
    { key: 'desayuno', label: 'DESAYUNO' },
    { key: 'almuerzo', label: 'ALMUERZO' },
    { key: 'cena', label: 'CENA' },
  ]

  return (
    <div>
      <StatsCards data={data} />
      {meals.map((m) => (
        data.comidas[m.key] && data.comidas[m.key].length > 0 ? (
          <MealSection
            key={m.key}
            mealKey={m.key}
            mealLabel={m.label}
            options={data.comidas[m.key]}
          />
        ) : null
      ))}
    </div>
  )
}

function FallbackPlan({ text }) {
  return (
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
        PLAN NUTRICIONAL TÁCTICO
      </div>
      <pre style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '11px',
        color: '#8DA38D',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        margin: 0,
      }}>
        {text}
      </pre>
    </div>
  )
}

function ConfigModal({ profile, form, setForm, onClose, onGenerate, loading, error }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        backgroundColor: '#1A1D1A',
        border: '1px solid #2A302A',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '440px',
        padding: '24px',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            backgroundColor: '#0F110F',
            border: '1px solid #2A302A',
            borderRadius: '50%',
            color: '#8DA38D',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Icon */}
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '12px' }}>🍴</div>

        {/* Title */}
        <div style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '18px',
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: '1px',
          marginBottom: '6px',
        }}>
          CONFIGURACIÓN DE SUMINISTROS
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#4B5E4B',
          textAlign: 'center',
          letterSpacing: '1px',
          marginBottom: '20px',
          lineHeight: 1.4,
        }}>
          LA IA TÁCTICA CALCULARÁ TUS REQUERIMIENTOS EXACTOS.
        </div>

        {/* Read-only rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'PESO ACTUAL', value: `${profile?.weight || form.weight || '—'} KG` },
            { label: 'OBJETIVO', value: `${profile?.targetWeight || form.targetWeight || '—'} KG` },
          ].map((row) => (
            <div key={row.label} style={{
              backgroundColor: '#0F110F',
              border: '1px solid #2A302A',
              borderRadius: '6px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4B5E4B',
                letterSpacing: '1px',
              }}>
                {row.label}
              </span>
              <span style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '14px',
                color: '#8DA38D',
              }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Editable inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '5px',
            }}>
              EDAD DEL OPERADOR *
            </label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              placeholder="Ej: 25"
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
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '5px',
            }}>
              ALERGIAS / RESTRICCIONES (OPCIONAL)
            </label>
            <input
              type="text"
              value={form.restrictions}
              onChange={(e) => setForm((f) => ({ ...f, restrictions: e.target.value }))}
              placeholder="ej: sin lactosa, alérgico a nueces..."
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
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(220,38,38,0.1)',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '4px',
            padding: '10px 12px',
            marginBottom: '12px',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#f87171',
          }}>
            ⚠ {error}
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#2A302A' : '#4B5E4B',
            border: 'none',
            borderRadius: '6px',
            color: loading ? '#8DA38D' : '#ffffff',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '14px',
            letterSpacing: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
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
              GENERANDO PLAN...
            </>
          ) : (
            'GENERAR PLAN TÁCTICO'
          )}
        </button>
      </div>
    </div>
  )
}

export default function NutritionModal({ approved, onClose, userEmail, profile }) {
  const [form, setForm] = useState({
    age: '',
    restrictions: '',
  })
  const [configOpen, setConfigOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [planRaw, setPlanRaw] = useState(null)
  const [planStructured, setPlanStructured] = useState(null)
  const [error, setError] = useState('')

  if (!approved) {
    return <UpsellScreen onClose={onClose} />
  }

  const handleGenerate = async () => {
    if (!form.age) {
      setError('Ingresa tu edad para generar el plan.')
      return
    }
    setLoading(true)
    setError('')
    setPlanRaw(null)
    setPlanStructured(null)

    const weight = profile?.weight || '—'
    const height = profile?.height || '—'
    const targetWeight = profile?.targetWeight || '—'

    try {
      const prompt = `Eres un nutricionista deportivo experto en calistenia. Crea un plan nutricional completo y personalizado en español latinoamericano.

Datos del operativo:
- Peso actual: ${weight} kg
- Altura: ${height} cm
- Edad: ${form.age} años
- Peso objetivo: ${targetWeight} kg
- Restricciones/alergias: ${form.restrictions || 'ninguna'}

Calcula TMB con fórmula Mifflin-St Jeor y ajusta calorías según objetivo (déficit si peso > objetivo, superávit leve si peso < objetivo).

Retorna ÚNICAMENTE un objeto JSON con esta estructura exacta (sin markdown, sin texto extra, puro JSON):
{
  "calorias": 2100,
  "proteina": 150,
  "tmb": 1750.8,
  "comidas": {
    "desayuno": [
      {
        "nombre": "Nombre del plato",
        "descripcion": "Descripción breve",
        "ingredientes": ["ingrediente 1 con cantidad", "ingrediente 2 con cantidad"]
      },
      {
        "nombre": "Segunda opción",
        "descripcion": "Descripción breve",
        "ingredientes": ["ingrediente 1 con cantidad"]
      }
    ],
    "almuerzo": [
      { "nombre": "...", "descripcion": "...", "ingredientes": ["..."] },
      { "nombre": "...", "descripcion": "...", "ingredientes": ["..."] }
    ],
    "cena": [
      { "nombre": "...", "descripcion": "...", "ingredientes": ["..."] },
      { "nombre": "...", "descripcion": "...", "ingredientes": ["..."] }
    ]
  }
}`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      )

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        setError('Error al generar el plan. Intenta de nuevo.')
        setLoading(false)
        return
      }

      // Try to parse as JSON
      try {
        // Strip markdown code fences if present
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
        const parsed = JSON.parse(cleaned)
        setPlanStructured(parsed)
      } catch {
        // Fallback to raw text display
        setPlanRaw(text)
      }

      setConfigOpen(false)
    } catch (err) {
      setError('Error de conexión. Verifica tu internet.')
    }
    setLoading(false)
  }

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
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8DA38D',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            cursor: 'pointer',
            letterSpacing: '1px',
            padding: 0,
          }}
        >
          ← VOLVER AL COMANDO
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '14px' }}>⊕</span>
          <span style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '14px',
            color: '#8DA38D',
            letterSpacing: '1px',
          }}>
            NUTRICIÓN TÁCTICA
          </span>
        </div>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>

        {/* GENERAR DIETA button card */}
        <div
          onClick={() => setConfigOpen(true)}
          style={{
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderLeft: '4px solid #4B5E4B',
            borderRadius: '10px',
            padding: '16px 18px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color 0.2s',
          }}
        >
          <div>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#4B5E4B',
                display: 'inline-block',
                animation: 'pulse-green 2s ease-in-out infinite',
              }} />
              IA ACTIVA // CLICK AQUÍ
            </div>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '18px',
              color: '#ffffff',
              letterSpacing: '2px',
            }}>
              GENERAR DIETA
            </div>
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '24px',
            color: '#4B5E4B',
          }}>
            ›
          </div>
        </div>

        {/* Separator */}
        <div style={{
          borderTop: '1px solid #2A302A',
          marginBottom: '20px',
        }} />

        {/* Arsenal section */}
        <div style={{
          fontFamily: '"Black Ops One", cursive',
          fontSize: '16px',
          color: '#ffffff',
          textAlign: 'center',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          ARSENAL SUPLEMENTARIO
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {SUPPLEMENTS.map((card) => (
            <SupplementCard key={card.id} card={card} />
          ))}
        </div>

        {/* Plan results */}
        {planStructured && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '2px',
              marginBottom: '14px',
              textAlign: 'center',
            }}>
              // PLAN NUTRICIONAL GENERADO //
            </div>
            <StructuredPlan data={planStructured} />
          </div>
        )}

        {planRaw && (
          <div style={{ marginBottom: '24px' }}>
            <FallbackPlan text={planRaw} />
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

      {/* Config modal overlay */}
      {configOpen && (
        <ConfigModal
          profile={profile}
          form={form}
          setForm={setForm}
          onClose={() => { setConfigOpen(false); setError('') }}
          onGenerate={handleGenerate}
          loading={loading}
          error={error}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
