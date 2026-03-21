import { useState, useEffect, useRef } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL   = 'gemini-2.5-flash-lite'

const SPANISH_SPEAKING_COUNTRIES = [
  'Argentina','Bolivia','Chile','Colombia','Costa Rica','Cuba','Ecuador',
  'El Salvador','España','Guatemala','Honduras','México','Nicaragua','Panamá',
  'Paraguay','Perú','Puerto Rico','República Dominicana','Uruguay','Venezuela'
]

const COUNTRY_FLAGS = {
  'Argentina':'🇦🇷','Bolivia':'🇧🇴','Chile':'🇨🇱','Colombia':'🇨🇴','Costa Rica':'🇨🇷',
  'Cuba':'🇨🇺','Ecuador':'🇪🇨','El Salvador':'🇸🇻','España':'🇪🇸','Guatemala':'🇬🇹',
  'Honduras':'🇭🇳','México':'🇲🇽','Nicaragua':'🇳🇮','Panamá':'🇵🇦','Paraguay':'🇵🇾',
  'Perú':'🇵🇪','Puerto Rico':'🇵🇷','República Dominicana':'🇩🇴','Uruguay':'🇺🇾','Venezuela':'🇻🇪'
}

const MEAL_META = {
  desayuno: { icon: '☀️', time: '07:00', label: 'DESAYUNO' },
  merienda: { icon: '⚡', time: '10:00', label: 'MERIENDA' },
  almuerzo: { icon: '🍽️', time: '13:00', label: 'ALMUERZO' },
  cena:     { icon: '🌙', time: '19:00', label: 'CENA' },
}

const MEAL_ORDER = ['desayuno','merienda','almuerzo','cena']

// ── MacroBar ─────────────────────────────────────────────────────────────────
function MacroBar({ label, value, unit, color, pct }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px' }}>{label}</span>
        <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '11px', color: '#fff' }}>
          {value}<span style={{ fontSize: '8px', color: '#4B5E4B' }}>{unit}</span>
        </span>
      </div>
      <div style={{ height: '4px', backgroundColor: '#0F110F', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(pct, 100)}%`,
          backgroundColor: color,
          borderRadius: '3px',
          boxShadow: `0 0 6px ${color}55`,
          transition: 'width 1s ease'
        }} />
      </div>
    </div>
  )
}

// ── HeroStats ─────────────────────────────────────────────────────────────────
function HeroStats({ dieta }) {
  const totalMacroKcal = dieta.proteina * 4 + dieta.carbos * 4 + dieta.grasa * 9
  const protPct  = Math.round((dieta.proteina * 4 / totalMacroKcal) * 100) || 0
  const carbsPct = Math.round((dieta.carbos * 4 / totalMacroKcal) * 100) || 0
  const fatPct   = Math.round((dieta.grasa * 9 / totalMacroKcal) * 100) || 0

  return (
    <div style={{
      backgroundColor: '#1A1D1A',
      border: '1px solid #2A302A',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, background: 'radial-gradient(circle, rgba(75,94,75,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>{dieta.emoji}</span>
        <div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#fff' }}>{dieta.nombre}</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '2px' }}>{dieta.tipo}</div>
        </div>
      </div>

      {/* Big calorie */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '48px', color: '#4ade80', lineHeight: 1 }}>{dieta.calorias}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px' }}>KCAL / DÍA</div>
      </div>

      {/* Stat boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'PROTEÍNA', value: `${dieta.proteina}g`, color: '#4ade80' },
          { label: 'CARBOS',   value: `${dieta.carbos}g`,   color: '#eab308' },
          { label: 'GRASA',    value: `${dieta.grasa}g`,    color: '#ef4444' },
          { label: 'AGUA',     value: `${dieta.agua_litros}L`, color: '#38bdf8' },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: '#0F110F', borderRadius: '8px', padding: '10px 6px', textAlign: 'center', border: '1px solid #2A302A' }}>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '16px', color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '1px', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Macro bars */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <MacroBar label="PROTEÍNA" value={dieta.proteina} unit="g" color="#4ade80" pct={protPct} />
        <MacroBar label="CARBOS"   value={dieta.carbos}   unit="g" color="#eab308" pct={carbsPct} />
        <MacroBar label="GRASA"    value={dieta.grasa}    unit="g" color="#ef4444" pct={fatPct} />
      </div>

      {/* Tags */}
      {dieta.tags && dieta.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
          {dieta.tags.map((tag, i) => (
            <span key={i} style={{
              backgroundColor: '#0F110F',
              border: '1px solid #4B5E4B',
              borderRadius: '20px',
              padding: '3px 10px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '1px'
            }}>{tag}</span>
          ))}
        </div>
      )}

      {dieta.tmb && (
        <div style={{ marginTop: '12px', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>
          TMB: <span style={{ color: '#c8a84b' }}>{dieta.tmb} kcal/día</span>
        </div>
      )}
    </div>
  )
}

// ── MealSection ───────────────────────────────────────────────────────────────
function MealSection({ mealKey, meal }) {
  const meta = MEAL_META[mealKey] || { icon: '🍴', time: '--:--', label: mealKey.toUpperCase() }

  return (
    <div style={{
      backgroundColor: '#1A1D1A',
      border: '1px solid #2A302A',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '10px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{meta.icon}</span>
          <div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '12px', color: '#4B5E4B', letterSpacing: '2px' }}>{meta.label}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>{meta.time}</div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#0F110F',
          border: '1px solid #4ade8033',
          borderRadius: '20px',
          padding: '4px 10px',
          fontFamily: '"Black Ops One", cursive',
          fontSize: '13px',
          color: '#4ade80'
        }}>{meal.kcal} kcal</div>
      </div>

      {/* Meal name + description */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{meal.nombre}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', lineHeight: 1.5 }}>{meal.descripcion}</div>
      </div>

      {/* Macro boxes */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'PROT', value: meal.proteina_g, color: '#4ade80' },
          { label: 'CARB', value: meal.carbos_g,   color: '#eab308' },
          { label: 'GRAS', value: meal.grasa_g,    color: '#ef4444' },
        ].map((m, i) => (
          <div key={i} style={{
            flex: 1,
            backgroundColor: '#0F110F',
            borderRadius: '6px',
            padding: '8px 6px',
            textAlign: 'center',
            border: `1px solid ${m.color}22`
          }}>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '15px', color: m.color }}>{m.value}g</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '1px', marginTop: '1px' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Ingredient chips */}
      {meal.ingredientes && meal.ingredientes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {meal.ingredientes.map((ing, i) => (
            <span key={i} style={{
              backgroundColor: '#252825',
              border: '1px solid #2A302A',
              borderRadius: '20px',
              padding: '3px 9px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#8DA38D'
            }}>{ing}</span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DietCard ──────────────────────────────────────────────────────────────────
function DietCard({ dieta, selected, onSelect }) {
  const totalMacroKcal = dieta.proteina * 4 + dieta.carbos * 4 + dieta.grasa * 9
  const protPct  = Math.round((dieta.proteina * 4 / totalMacroKcal) * 100) || 0
  const carbsPct = Math.round((dieta.carbos * 4 / totalMacroKcal) * 100) || 0
  const fatPct   = Math.round((dieta.grasa * 9 / totalMacroKcal) * 100) || 0

  return (
    <div
      onClick={() => onSelect(dieta)}
      style={{
        backgroundColor: selected ? '#1a2a1a' : '#1A1D1A',
        border: `1px solid ${selected ? '#4B5E4B' : '#2A302A'}`,
        borderLeft: `4px solid ${selected ? '#4ade80' : '#2A302A'}`,
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Left: emoji + name + type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: '28px', flexShrink: 0 }}>{dieta.emoji}</span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '13px',
            color: '#fff',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>{dieta.nombre}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              backgroundColor: '#4B5E4B22',
              border: '1px solid #4B5E4B55',
              borderRadius: '20px',
              padding: '2px 8px',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '8px',
              color: '#4B5E4B',
              letterSpacing: '1px'
            }}>{dieta.tipo}</span>
          </div>
        </div>
      </div>

      {/* Middle: micro bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100px', flexShrink: 0 }}>
        {[
          { label: 'P', value: dieta.proteina, color: '#4ade80', pct: protPct },
          { label: 'C', value: dieta.carbos,   color: '#eab308', pct: carbsPct },
          { label: 'G', value: dieta.grasa,    color: '#ef4444', pct: fatPct },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', width: '8px' }}>{m.label}</span>
            <div style={{ flex: 1, height: '3px', backgroundColor: '#0F110F', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(m.pct, 100)}%`, backgroundColor: m.color, borderRadius: '2px' }} />
            </div>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#8DA38D', width: '28px', textAlign: 'right' }}>{m.value}g</span>
          </div>
        ))}
      </div>

      {/* Right: kcal + arrow */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#4ade80' }}>{dieta.calorias}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B' }}>kcal</div>
        <div style={{ color: '#4B5E4B', fontSize: '14px', marginTop: '4px' }}>{selected ? '✓' : '›'}</div>
      </div>
    </div>
  )
}

// ── ConfigModal ───────────────────────────────────────────────────────────────
function ConfigModal({ open, onClose, onSubmit, profile, loading }) {
  const [sex, setSex] = useState('MASCULINO')
  const [age, setAge] = useState('')
  const [country, setCountry] = useState('México')
  const [activity, setActivity] = useState('Moderado (3-5x por semana)')
  const [goal, setGoal] = useState('Perda de Gordura')
  const [restrictions, setRestrictions] = useState('')

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ sex, age, country, activity, goal, restrictions })
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0F110F',
    border: '1px solid #2A302A',
    borderRadius: '6px',
    padding: '10px 12px',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '12px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '9px',
    color: '#4B5E4B',
    letterSpacing: '2px',
    marginBottom: '6px',
    display: 'block'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#151715',
        border: '1px solid #2A302A',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '440px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#fff' }}>🍴 CONFIGURAR PLANO</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginTop: '2px' }}>PERSONALIZACIÓN TÁCTICA</div>
          </div>
          <button onClick={onClose} style={{ backgroundColor: 'transparent', border: '1px solid #2A302A', borderRadius: '50%', width: 32, height: 32, color: '#8DA38D', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Profile preview cards */}
        {profile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '20px' }}>
            {[
              { label: 'PESO', value: `${profile.weight}kg` },
              { label: 'META', value: `${profile.targetWeight}kg` },
              { label: 'ALTURA', value: `${profile.height}cm` },
              { label: 'BIÓTIPO', value: profile.biotype },
            ].map((c, i) => (
              <div key={i} style={{ backgroundColor: '#0F110F', border: '1px solid #2A302A', borderRadius: '6px', padding: '8px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: '#c8a84b' }}>{c.value}</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '1px', marginTop: '2px' }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Sex toggle */}
          <div>
            <label style={labelStyle}>SEXO</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['MASCULINO','FEMININO'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: sex === s ? '#4B5E4B' : '#0F110F',
                    border: `1px solid ${sex === s ? '#4B5E4B' : '#2A302A'}`,
                    borderRadius: '6px',
                    color: sex === s ? '#fff' : '#4B5E4B',
                    fontFamily: '"Black Ops One", cursive',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >{s === 'MASCULINO' ? '♂ MASCULINO' : '♀ FEMININO'}</button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <label style={labelStyle}>EDAD</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Ej: 28"
              required
              min="10"
              max="100"
              style={inputStyle}
            />
          </div>

          {/* Country */}
          <div>
            <label style={labelStyle}>PAÍS</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              style={inputStyle}
            >
              {SPANISH_SPEAKING_COUNTRIES.map(c => (
                <option key={c} value={c}>{COUNTRY_FLAGS[c]} {c}</option>
              ))}
            </select>
          </div>

          {/* Activity */}
          <div>
            <label style={labelStyle}>NIVEL DE ACTIVIDAD</label>
            <select value={activity} onChange={e => setActivity(e.target.value)} style={inputStyle}>
              <option>Sedentario</option>
              <option>Ligero (1-3x por semana)</option>
              <option>Moderado (3-5x por semana)</option>
              <option>Activo (5-6x por semana)</option>
              <option>Muy Activo (diario)</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label style={labelStyle}>OBJETIVO</label>
            <select value={goal} onChange={e => setGoal(e.target.value)} style={inputStyle}>
              <option>Perda de Gordura</option>
              <option>Ganancia Muscular</option>
              <option>Recomposición Corporal</option>
              <option>Mantenimiento</option>
            </select>
          </div>

          {/* Restrictions */}
          <div>
            <label style={labelStyle}>RESTRICCIONES ALIMENTARIAS</label>
            <textarea
              value={restrictions}
              onChange={e => setRestrictions(e.target.value)}
              placeholder="ej: sin lactosa, vegetariano..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px',
              backgroundColor: loading ? '#2A302A' : '#4B5E4B',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: '"Black Ops One", cursive',
              fontSize: '15px',
              letterSpacing: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? '⏳ GENERANDO...' : '⚡ GENERAR 10 PLANES'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── ShoppingList ──────────────────────────────────────────────────────────────
function ShoppingList({ dieta }) {
  const [checked, setChecked] = useState({})

  // Aggregate all ingredients
  const allIngredients = []
  MEAL_ORDER.forEach(mealKey => {
    const meal = dieta.comidas[mealKey]
    if (meal && meal.ingredientes) {
      meal.ingredientes.forEach(ing => {
        if (!allIngredients.includes(ing)) {
          allIngredients.push(ing)
        }
      })
    }
  })

  const toggle = (ing) => setChecked(prev => ({ ...prev, [ing]: !prev[ing] }))
  const doneCount = Object.values(checked).filter(Boolean).length

  return (
    <div>
      <div style={{
        backgroundColor: '#1A1D1A',
        border: '1px solid #2A302A',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '16px', color: '#fff' }}>🛒 LISTA DE COMPRAS</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginTop: '2px' }}>{dieta.nombre}</div>
          </div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: '#4ade80' }}>
            {doneCount}/{allIngredients.length}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: '4px', backgroundColor: '#0F110F', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${allIngredients.length ? (doneCount / allIngredients.length) * 100 : 0}%`,
            backgroundColor: '#4ade80',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Ingredient list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allIngredients.map((ing, i) => (
            <div
              key={i}
              onClick={() => toggle(ing)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                backgroundColor: checked[ing] ? '#0F110F' : '#151715',
                border: `1px solid ${checked[ing] ? '#4ade8022' : '#2A302A'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '4px',
                border: `2px solid ${checked[ing] ? '#4ade80' : '#4B5E4B'}`,
                backgroundColor: checked[ing] ? '#4ade80' : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#0F110F',
                transition: 'all 0.15s'
              }}>{checked[ing] ? '✓' : ''}</div>
              <span style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '12px',
                color: checked[ing] ? '#4B5E4B' : '#8DA38D',
                textDecoration: checked[ing] ? 'line-through' : 'none',
                transition: 'all 0.15s'
              }}>{ing}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SupplementCard ────────────────────────────────────────────────────────────
function SupplementCard({ icon, name, dose, timing, benefit, priority }) {
  const priorityColors = { high: '#ef4444', medium: '#eab308', low: '#4ade80' }
  return (
    <div style={{
      backgroundColor: '#1A1D1A',
      border: '1px solid #2A302A',
      borderRadius: '10px',
      padding: '16px',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#fff' }}>{name}</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', marginTop: '2px' }}>{dose}</div>
        </div>
        <div style={{
          backgroundColor: `${priorityColors[priority]}22`,
          border: `1px solid ${priorityColors[priority]}55`,
          borderRadius: '20px',
          padding: '3px 8px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '7px',
          color: priorityColors[priority],
          letterSpacing: '1px'
        }}>{priority.toUpperCase()}</div>
      </div>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', lineHeight: 1.5, marginBottom: '6px' }}>{benefit}</div>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>⏰ {timing}</div>
    </div>
  )
}

function ArsenalTab() {
  const supplements = [
    { icon: '💊', name: 'CREATINA MONOHIDRATO', dose: '5g / día', timing: 'Post-entrenamiento o con comida', benefit: 'Aumenta fuerza, potencia y volumen muscular. El suplemento más estudiado y efectivo.', priority: 'high' },
    { icon: '🥛', name: 'PROTEÍNA WHEY', dose: '25-30g / post-entrenamiento', timing: 'Dentro de 30 min post-entrenamiento', benefit: 'Estimula síntesis proteica muscular. Recuperación y crecimiento acelerado.', priority: 'high' },
    { icon: '⚡', name: 'CAFEÍNA', dose: '200-400mg / pre-entreno', timing: '30-45 min antes del entrenamiento', benefit: 'Aumenta rendimiento, fuerza y quema de grasa. Reduce percepción de fatiga.', priority: 'medium' },
    { icon: '🐟', name: 'OMEGA-3', dose: '2-3g EPA+DHA / día', timing: 'Con comida principal', benefit: 'Reduce inflamación, mejora recuperación y salud cardiovascular.', priority: 'medium' },
    { icon: '☀️', name: 'VITAMINA D3', dose: '2000-4000 IU / día', timing: 'Mañana con grasa', benefit: 'Regula testosterona, función inmune y salud ósea. Deficiencia muy común.', priority: 'medium' },
    { icon: '😴', name: 'MAGNESIO GLICINATO', dose: '300-400mg / noche', timing: '30-60 min antes de dormir', benefit: 'Mejora calidad del sueño, recuperación muscular y reduce cortisol.', priority: 'low' },
  ]
  return (
    <div>
      <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '4px' }}>// ARSENAL SUPLEMENTARIO //</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', lineHeight: 1.5 }}>Suplementos ordenados por prioridad científica para maximizar resultados.</div>
      </div>
      {supplements.map((s, i) => <SupplementCard key={i} {...s} />)}
    </div>
  )
}

// ── Main NutritionModal ───────────────────────────────────────────────────────
export default function NutritionModal({ onClose, userEmail, profile }) {
  const [dietasData, setDietasData] = useState(null)
  const [selectedDieta, setSelectedDieta] = useState(null)
  const [activeTab, setActiveTab] = useState('planes')
  const [configOpen, setConfigOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const detailRef = useRef(null)

  const cacheKey = `nutrition_dietas_cache_${userEmail}`

  // Load cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (parsed && parsed.dietas && parsed.dietas.length > 0) {
          setDietasData(parsed)
        }
      }
    } catch (_) {}
  }, [cacheKey])

  // Scroll to detail when diet is selected
  useEffect(() => {
    if (selectedDieta && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [selectedDieta])

  const handleGenerate = async ({ sex, age, country, activity, goal, restrictions }) => {
    setLoading(true)
    setError('')
    setSelectedDieta(null)

    const prompt = `Eres un nutricionista experto. Crea exactamente 10 planes de dieta diferentes y completos para esta persona:
- País: ${country} (usa EXCLUSIVAMENTE alimentos típicos, accesibles y económicos de ${country})
- Objetivo: ${goal}
- Sexo: ${sex}
- Edad: ${age} años
- Peso actual: ${profile?.weight || '?'}kg | Objetivo: ${profile?.targetWeight || '?'}kg
- Altura: ${profile?.height || '?'}cm
- Nivel de actividad: ${activity}
- Restricciones: ${restrictions || 'ninguna'}

Devuelve SOLO JSON válido con esta estructura exacta (sin texto adicional):
{
  "pais": "${country}",
  "objetivo": "${goal}",
  "dietas": [
    {
      "id": 1,
      "nombre": "nombre creativo con ingrediente local",
      "tipo": "Alta Proteína",
      "emoji": "🥩",
      "descripcion": "descripción breve de 1 línea",
      "tags": ["Ganancia Muscular","Sin Gluten"],
      "calorias": 2400,
      "proteina": 200,
      "carbos": 220,
      "grasa": 75,
      "agua_litros": 3.0,
      "tmb": 1850,
      "comidas": {
        "desayuno": {"nombre":"...","descripcion":"...","kcal":600,"proteina_g":50,"carbos_g":55,"grasa_g":20,"ingredientes":["item1","item2","item3"]},
        "merienda": {"nombre":"...","descripcion":"...","kcal":250,"proteina_g":25,"carbos_g":20,"grasa_g":8,"ingredientes":["item1","item2"]},
        "almuerzo": {"nombre":"...","descripcion":"...","kcal":800,"proteina_g":65,"carbos_g":80,"grasa_g":25,"ingredientes":["item1","item2","item3","item4"]},
        "cena": {"nombre":"...","descripcion":"...","kcal":550,"proteina_g":50,"carbos_g":45,"grasa_g":18,"ingredientes":["item1","item2","item3"]}
      }
    }
  ]
}

Los 10 tipos DEBEN ser: Clásica Local, Alta Proteína, Bajo Carbohidrato, Cetogénica, Ayuno 16:8, Volumen Limpio, Definición, Mediterránea Adaptada, Vegetariana Local, Flexible IIFYM`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 8000,
              temperature: 0.7
            }
          })
        }
      )

      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const data = await res.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

      // Extract JSON from response
      let jsonStr = rawText.trim()
      const startIdx = jsonStr.indexOf('{')
      const endIdx = jsonStr.lastIndexOf('}')
      if (startIdx !== -1 && endIdx !== -1) {
        jsonStr = jsonStr.slice(startIdx, endIdx + 1)
      }

      let parsed
      try {
        parsed = JSON.parse(jsonStr)
      } catch (parseErr) {
        throw new Error('No se pudo parsear el JSON de la IA. Intenta de nuevo.')
      }

      if (!parsed.dietas || !Array.isArray(parsed.dietas) || parsed.dietas.length === 0) {
        throw new Error('La respuesta no contiene dietas válidas. Intenta de nuevo.')
      }

      setDietasData(parsed)
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsed))
      } catch (_) {}
      setConfigOpen(false)
    } catch (err) {
      setError(err.message || 'Error al generar planes. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDieta = (dieta) => {
    setSelectedDieta(prev => prev?.id === dieta.id ? null : dieta)
  }

  const handleNuevo = () => {
    setDietasData(null)
    setSelectedDieta(null)
    setError('')
    try { localStorage.removeItem(cacheKey) } catch (_) {}
    setConfigOpen(true)
  }

  const tabs = [
    { key: 'planes',  label: '🗂 PLANES' },
    { key: 'arsenal', label: '💊 ARSENAL' },
    ...(selectedDieta ? [{ key: 'compras', label: '🛒 COMPRAS' }] : []),
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: '#0F110F', overflowY: 'auto' }}>

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        backgroundColor: '#151715',
        borderBottom: '1px solid #2A302A',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button
          onClick={onClose}
          style={{ backgroundColor: 'transparent', border: 'none', color: '#4B5E4B', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >← VOLVER</button>

        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#8DA38D', letterSpacing: '2px' }}>
          🥗 NUTRICIÓN TÁCTICA
        </div>

        <button
          onClick={dietasData ? handleNuevo : () => setConfigOpen(true)}
          style={{
            backgroundColor: '#4B5E4B',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            color: '#fff',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '10px',
            letterSpacing: '1px',
            cursor: 'pointer'
          }}
        >{dietasData ? 'NUEVO' : 'GENERAR'}</button>
      </div>

      {/* Tab bar */}
      <div style={{
        position: 'sticky', top: 57, zIndex: 9,
        backgroundColor: '#0F110F',
        borderBottom: '1px solid #2A302A',
        display: 'flex'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '12px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #4ade80' : '2px solid transparent',
              color: activeTab === tab.key ? '#4ade80' : '#4B5E4B',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '10px',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '16px' }}>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#2a1a1a', border: '1px solid #ef4444', borderRadius: '10px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#ef4444', lineHeight: 1.5 }}>⚠ {error}</div>
            <button
              onClick={() => { setError(''); setConfigOpen(true) }}
              style={{ backgroundColor: '#ef4444', border: 'none', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '10px', cursor: 'pointer', flexShrink: 0 }}
            >REINTENTAR</button>
          </div>
        )}

        {/* PLANES TAB */}
        {activeTab === 'planes' && (
          <div>
            {!dietasData ? (
              /* Generate card */
              <div style={{
                backgroundColor: '#1A1D1A',
                border: '1px solid #2A302A',
                borderRadius: '14px',
                padding: '32px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '16px'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(75,94,75,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>🥗</div>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '22px', color: '#fff', marginBottom: '8px' }}>10 PLANES DE DIETA</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', lineHeight: 1.6, marginBottom: '20px' }}>
                  10 planes completos adaptados a tu país y objetivo, con lista de compras incluida.
                </div>
                <button
                  onClick={() => setConfigOpen(true)}
                  style={{
                    padding: '14px 32px',
                    backgroundColor: '#4B5E4B',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: '"Black Ops One", cursive',
                    fontSize: '16px',
                    letterSpacing: '2px',
                    cursor: 'pointer'
                  }}
                >⚡ GENERAR PLANES</button>
              </div>
            ) : (
              <div>
                {/* Header info */}
                <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '10px', padding: '12px 16px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{COUNTRY_FLAGS[dietasData.pais] || '🌎'}</span>
                  <div>
                    <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: '#fff' }}>{dietasData.pais} — {dietasData.objetivo}</div>
                    <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px', marginTop: '2px' }}>SELECCIONA UN PLAN PARA VER DETALLE</div>
                  </div>
                </div>

                {/* 10 diet cards */}
                {dietasData.dietas.map(dieta => (
                  <DietCard
                    key={dieta.id}
                    dieta={dieta}
                    selected={selectedDieta?.id === dieta.id}
                    onSelect={handleSelectDieta}
                  />
                ))}

                {/* Selected diet detail */}
                {selectedDieta && (
                  <div ref={detailRef} style={{ marginTop: '20px' }}>
                    <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '12px', textAlign: 'center' }}>// DETALLE DEL PLAN SELECCIONADO //</div>
                    <HeroStats dieta={selectedDieta} />
                    {MEAL_ORDER.map(mealKey => {
                      const meal = selectedDieta.comidas?.[mealKey]
                      if (!meal) return null
                      return <MealSection key={mealKey} mealKey={mealKey} meal={meal} />
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ARSENAL TAB */}
        {activeTab === 'arsenal' && <ArsenalTab />}

        {/* COMPRAS TAB */}
        {activeTab === 'compras' && selectedDieta && (
          <ShoppingList dieta={selectedDieta} />
        )}

      </div>

      {/* Config modal */}
      <ConfigModal
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        onSubmit={handleGenerate}
        profile={profile}
        loading={loading}
      />

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          backgroundColor: 'rgba(15,17,15,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '20px'
        }}>
          <div className="pulse-green" style={{ width: 60, height: 60, borderRadius: '50%', backgroundColor: '#4B5E4B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🥗</div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#fff', letterSpacing: '3px' }}>GENERANDO PLANES</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#4B5E4B', letterSpacing: '2px' }}>Calculando 10 dietas personalizadas...</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>Puede tardar 15-30 segundos</div>
        </div>
      )}
    </div>
  )
}
