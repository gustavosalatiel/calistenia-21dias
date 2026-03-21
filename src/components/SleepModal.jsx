import { useState } from 'react'

const moduleStyle = {
  backgroundColor: '#1A1D1A',
  border: '1px solid #2A302A',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
}

const sectionTitle = (text) => (
  <div style={{
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '9px',
    color: '#4B5E4B',
    letterSpacing: '3px',
    marginBottom: '10px',
  }}>
    {text}
  </div>
)

const moduleHeader = (icon, title, subtitle) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
    <div style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#0F110F',
      border: '1px solid #4B5E4B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{
        fontFamily: '"Black Ops One", cursive',
        fontSize: '14px',
        color: '#ffffff',
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '10px',
        color: '#8DA38D',
      }}>
        {subtitle}
      </div>
    </div>
  </div>
)

function InfoBlock({ title, items }) {
  return (
    <div style={{
      backgroundColor: '#0F110F',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '10px',
      border: '1px solid #2A302A',
    }}>
      <div style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '10px',
        color: '#8DA38D',
        marginBottom: '8px',
        fontWeight: 'bold',
      }}>
        {title}
      </div>
      <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
        {items.map((item, i) => (
          <li key={i} style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#8DA38D',
            lineHeight: 1.5,
            marginBottom: '4px',
          }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ChecklistItem({ text }) {
  const [checked, setChecked] = useState(false)
  return (
    <button
      onClick={() => setChecked(!checked)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 0',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '3px',
        backgroundColor: checked ? '#4B5E4B' : 'transparent',
        border: checked ? 'none' : '1px solid #4B5E4B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        color: '#fff',
        flexShrink: 0,
        marginTop: '1px',
      }}>
        {checked ? '✓' : ''}
      </div>
      <span style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '11px',
        color: checked ? '#4B5E4B' : '#8DA38D',
        lineHeight: 1.4,
        textDecoration: checked ? 'line-through' : 'none',
      }}>
        {text}
      </span>
    </button>
  )
}

export default function SleepModal({ onClose }) {
  const [logForm, setLogForm] = useState({
    horas: '',
    horaDormir: '',
    horaDespertar: '',
    ereccion: '',
    estadoAnimo: '',
    notas: '',
  })
  const [logSaved, setLogSaved] = useState(false)

  const handleSaveLog = () => {
    const logs = JSON.parse(localStorage.getItem('sleep_logs') || '[]')
    logs.push({ ...logForm, fecha: new Date().toISOString() })
    localStorage.setItem('sleep_logs', JSON.stringify(logs))
    setLogSaved(true)
    setTimeout(() => setLogSaved(false), 3000)
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
        <div>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '2px',
          }}>
            MÓDULO DE RECUPERACIÓN
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '18px',
            color: '#8DA38D',
          }}>
            PROTOCOLO DE SUEÑO
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

        {/* MODULE 1 */}
        <div style={moduleStyle}>
          {moduleHeader('🔬', 'MÓDULO 1', 'BIOLOGÍA DEL GUERRERO')}

          <InfoBlock
            title="La Erección Matutina como Check Engine"
            items={[
              'La erección matutina = testosterona óptima y sueño REM completo',
              'Ausente: indica déficit de sueño, estrés elevado o cortisol descontrolado',
              'Monitorea este indicador diariamente como tu check de salud hormonal',
            ]}
          />

          <InfoBlock
            title="La Tríada Nocturna (2 horas antes de dormir)"
            items={[
              '🥩 Proteínas + grasas: carne, huevo, aguacate → elevan testosterona nocturna',
              '🍌 Carbos de bajo índice glucémico: camote, avena → serotonina → melatonina',
              '💊 Zinc + Magnesio: semillas de calabaza, espinaca → liberación de GH en sueño profundo',
            ]}
          />

          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4B5E4B',
            marginBottom: '8px',
            letterSpacing: '1px',
          }}>
            CHECKLIST NOCTURNA
          </div>
          {[
            'Comí mi Tríada Nocturna 2h antes de dormir',
            'Tomé zinc/magnesio o comí fuentes naturales',
            'Evité azúcar y alcohol las últimas 3 horas',
            'Última exposición a pantalla fue hace 60+ min',
          ].map((item, i) => <ChecklistItem key={i} text={item} />)}
        </div>

        {/* MODULE 2 */}
        <div style={moduleStyle}>
          {moduleHeader('🌙', 'MÓDULO 2', 'RITUAL DE APAGADO 21:00H')}

          <InfoBlock
            title="Protocolo de Desconexión Digital"
            items={[
              '21:00h → Modo avión en teléfono. Pantalla con filtro naranja si necesitas usarlo',
              'Luz azul suprime melatonina 3h. Sin esto, tu ritmo circadiano está roto',
              'Reemplaza pantalla por: lectura con luz cálida, meditación, estiramiento',
            ]}
          />

          <InfoBlock
            title="Ducha de Contraste Anti-Cortisol"
            items={[
              '2 minutos agua caliente → 30-60 segundos agua fría (lo más fría posible)',
              'El choque térmico activa el sistema nervioso parasimpático',
              'Resultado: bajada de cortisol + activación de melatonina natural',
            ]}
          />

          <InfoBlock
            title="ZMA: El Hack Hormonal del Soldado"
            items={[
              '30 minutos antes de dormir, con estómago vacío o ligero',
              'Zinc: 25-30mg | Magnesio: 200-400mg | B6: 5-10mg',
              'Potencia sueño profundo, libera GH, mejora recuperación muscular',
            ]}
          />

          <InfoBlock
            title="Respiración 4-7-8 Anti-Cortisol"
            items={[
              'Inhala 4 segundos por la nariz',
              'Retén el aire 7 segundos',
              'Exhala completamente 8 segundos por la boca',
              'Repite 4 ciclos → activa nervio vago → calma el sistema nervioso',
            ]}
          />
        </div>

        {/* MODULE 3 */}
        <div style={moduleStyle}>
          {moduleHeader('⚡', 'MÓDULO 3', 'EL RESET 72H')}

          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#8DA38D',
            lineHeight: 1.5,
            marginBottom: '12px',
          }}>
            Si llevas semanas sin dormir bien, necesitas un reset de 3 días para restablecer tu ritmo circadiano.
          </div>

          {[
            {
              day: 'DÍA 1',
              title: 'REDUCCIÓN DE ESTÍMULOS',
              actions: [
                'Sin alcohol, sin cafeína después de las 14:00h',
                'Exposición solar 10-15 min al despertar (regula cortisol matutino)',
                'Cena ligera 3 horas antes de dormir',
                'Ducha de contraste nocturna obligatoria',
              ]
            },
            {
              day: 'DÍA 2',
              title: 'NORMALIZACIÓN HORMONAL',
              actions: [
                'Hora fija de despertarse (aunque hayas dormido poco)',
                'No dormir siesta de más de 20 min antes de las 15:00h',
                'Ejercicio intenso en la mañana (tu entrenamiento del programa)',
                'Sin pantallas 90 min antes de dormir',
              ]
            },
            {
              day: 'DÍA 3',
              title: 'CONSOLIDACIÓN DEL CICLO',
              actions: [
                'Mantén exactamente la misma hora de dormir y despertar que el día 2',
                'Protocolo ZMA esta noche',
                'Respiración 4-7-8 (mínimo 8 ciclos)',
                'Tu ritmo circadiano estará calibrado de nuevo',
              ]
            }
          ].map((module, i) => (
            <div key={i} style={{
              backgroundColor: '#0F110F',
              border: '1px solid #2A302A',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '12px',
                  color: '#4B5E4B',
                  backgroundColor: 'rgba(75,94,75,0.2)',
                  border: '1px solid #4B5E4B',
                  padding: '2px 8px',
                  borderRadius: '3px',
                }}>
                  {module.day}
                </span>
                <span style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '12px',
                  color: '#8DA38D',
                }}>
                  {module.title}
                </span>
              </div>
              {module.actions.map((action, j) => (
                <ChecklistItem key={j} text={action} />
              ))}
            </div>
          ))}
        </div>

        {/* SLEEP LOG */}
        <div style={moduleStyle}>
          {moduleHeader('📊', 'DIARIO DE SUEÑO', 'REGISTRO NOCTURNO')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {[
              { key: 'horas', label: 'HORAS DORMIDAS', type: 'number', placeholder: 'ej: 7.5' },
              { key: 'horaDormir', label: 'HORA QUE DORMISTE', type: 'time', placeholder: '' },
              { key: 'horaDespertar', label: 'HORA QUE DESPERTASTE', type: 'time', placeholder: '' },
            ].map(field => (
              <div key={field.key}>
                <label style={{
                  display: 'block',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '8px',
                  color: '#4B5E4B',
                  letterSpacing: '1px',
                  marginBottom: '4px',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={logForm[field.key]}
                  onChange={(e) => setLogForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F110F',
                    border: '1px solid #2A302A',
                    borderRadius: '4px',
                    padding: '8px 10px',
                    color: '#e5e7eb',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            ))}

            <div>
              <label style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '8px',
                color: '#4B5E4B',
                letterSpacing: '1px',
                marginBottom: '4px',
              }}>
                ERECCIÓN MATUTINA
              </label>
              <select
                value={logForm.ereccion}
                onChange={(e) => setLogForm(prev => ({ ...prev, ereccion: e.target.value }))}
                style={{
                  width: '100%',
                  backgroundColor: '#0F110F',
                  border: '1px solid #2A302A',
                  borderRadius: '4px',
                  padding: '8px 10px',
                  color: logForm.ereccion ? '#e5e7eb' : '#4B5E4B',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '11px',
                  outline: 'none',
                }}
              >
                <option value="">Seleccionar</option>
                <option value="SI">SI</option>
                <option value="PARCIAL">PARCIAL</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              ESTADO DE ÁNIMO AL DESPERTAR
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['😴 Muy cansado', '😐 Regular', '😊 Bien', '💪 Excelente'].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setLogForm(prev => ({ ...prev, estadoAnimo: mood }))}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    backgroundColor: logForm.estadoAnimo === mood ? 'rgba(75,94,75,0.3)' : '#0F110F',
                    border: logForm.estadoAnimo === mood ? '1px solid #4B5E4B' : '1px solid #2A302A',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: '9px',
                    color: logForm.estadoAnimo === mood ? '#8DA38D' : '#4B5E4B',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}>
              NOTAS
            </label>
            <textarea
              value={logForm.notas}
              onChange={(e) => setLogForm(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Observaciones del sueño..."
              rows={2}
              style={{
                width: '100%',
                backgroundColor: '#0F110F',
                border: '1px solid #2A302A',
                borderRadius: '4px',
                padding: '8px 10px',
                color: '#e5e7eb',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '11px',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          {logSaved && (
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
              ✓ Registro guardado correctamente
            </div>
          )}

          <button
            onClick={handleSaveLog}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4B5E4B',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontFamily: '"Black Ops One", cursive',
              fontSize: '13px',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
          >
            GUARDAR REGISTRO
          </button>
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
