import { useState, useEffect } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL   = 'gemini-2.5-flash-lite'
const PLAN_CACHE_KEY = 'nutrition_plan_cache'

// ── Upsell (bloqueado) ───────────────────────────────────────────────────────
function UpsellScreen({ onClose }) {
  const features = [
    { icon: '⚡', text: 'Acelera tu metabolismo x3 con plan científico' },
    { icon: '🔥', text: 'Elimina grasa visceral con alimentación estratégica' },
    { icon: '🤖', text: 'Plan 100% personalizado por IA según tu cuerpo' },
    { icon: '💪', text: 'Macros calculados para máxima ganancia muscular' },
    { icon: '🛒', text: 'Lista de compras táctica por semana' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: '#0F110F', overflowY: 'auto' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '16px', color: '#8DA38D' }}>NUTRICIÓN TÁCTICA</div>
        <button onClick={onClose} style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8DA38D', fontSize: '16px' }}>✕</button>
      </div>
      <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '12px', padding: '32px 20px', marginBottom: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(75,94,75,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '8px' }}>MÓDULO BLOQUEADO</div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '22px', color: '#ffffff', lineHeight: 1.2, marginBottom: '12px' }}>NUTRICIÓN DE COMBATE</div>
          <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: '#8DA38D', lineHeight: 1.6 }}>La herramienta de IA más poderosa para acelerar tus resultados físicos.</p>
        </div>
        <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '14px' }}>LO QUE INCLUYE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: '#8DA38D', lineHeight: 1.4 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => window.open('https://pay.kiwify.com/mHGhge4', '_blank')} style={{ width: '100%', padding: '16px', backgroundColor: '#4B5E4B', border: 'none', borderRadius: '6px', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '16px', letterSpacing: '2px', cursor: 'pointer', marginBottom: '12px' }}>
          OBTENER ACCESO AHORA →
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid #2A302A', borderRadius: '6px', color: '#4B5E4B', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', cursor: 'pointer' }}>
          ← VOLVER AL CUARTEL
        </button>
      </div>
    </div>
  )
}

// ── Macro bar visual ─────────────────────────────────────────────────────────
function MacroBar({ label, value, unit, color, pct }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px' }}>{label}</span>
        <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '12px', color: '#fff' }}>{value}<span style={{ fontSize: '9px', color: '#4B5E4B' }}>{unit}</span></span>
      </div>
      <div style={{ height: '5px', backgroundColor: '#0F110F', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, backgroundColor: color, borderRadius: '3px', boxShadow: `0 0 6px ${color}55`, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ── Hero stats card ──────────────────────────────────────────────────────────
function HeroStats({ plan, profile }) {
  const totalMacroKcal = plan.proteina * 4 + plan.carbos * 4 + plan.gordura * 9
  const protPct  = Math.round((plan.proteina * 4 / totalMacroKcal) * 100) || 0
  const carbsPct = Math.round((plan.carbos * 4 / totalMacroKcal) * 100) || 0
  const fatPct   = Math.round((plan.gordura * 9 / totalMacroKcal) * 100) || 0

  return (
    <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '12px', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(75,94,75,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '14px' }}>// DIAGNÓSTICO NUTRICIONAL //</div>

      {/* Calorie ring area */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        {/* Big calorie number */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '40px', color: '#4ade80', lineHeight: 1 }}>{plan.calorias}</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px' }}>KCAL / DÍA</div>
        </div>
        <div style={{ width: 1, height: 50, backgroundColor: '#2A302A' }} />
        {/* Stats column */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'PESO ATUAL', value: `${profile?.weight || '—'}`, unit: 'kg' },
            { label: 'OBJETIVO', value: `${profile?.targetWeight || '—'}`, unit: 'kg' },
            { label: 'TMB', value: `${Math.round(plan.tmb)}`, unit: 'kcal' },
            { label: 'ÁGUA', value: `${plan.agua_litros || '—'}`, unit: 'L/dia' },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: '#0F110F', borderRadius: '6px', padding: '8px', border: '1px solid #2A302A' }}>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '15px', color: '#8DA38D' }}>{s.value}<span style={{ fontSize: '9px', color: '#4B5E4B' }}>{s.unit}</span></div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Macro bars */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <MacroBar label={`PROTEÍNA ${protPct}%`}  value={plan.proteina} unit="g" color="#4ade80" pct={protPct} />
        <MacroBar label={`CARBOS ${carbsPct}%`}   value={plan.carbos}   unit="g" color="#fbbf24" pct={carbsPct} />
        <MacroBar label={`GORDURA ${fatPct}%`}    value={plan.gordura}  unit="g" color="#f87171" pct={fatPct} />
      </div>
    </div>
  )
}

// ── Meal card ────────────────────────────────────────────────────────────────
const MEAL_META = {
  desayuno: { label: 'DESAYUNO', icon: '☀️', time: '07:00 – 08:00' },
  merienda: { label: 'PRE-TREINO', icon: '⚡', time: '10:00 – 11:00' },
  almuerzo: { label: 'ALMUERZO', icon: '🍽️', time: '12:00 – 13:00' },
  cena:     { label: 'CENA', icon: '🌙', time: '19:00 – 20:00' },
}

function MealSection({ mealKey, options }) {
  const [tab, setTab] = useState(0)
  const meta   = MEAL_META[mealKey] || { label: mealKey.toUpperCase(), icon: '🍴', time: '' }
  const option = options[tab] || {}

  return (
    <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
      {/* Meal header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #2A302A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{meta.icon}</span>
          <div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: '#ffffff', letterSpacing: '1px' }}>{meta.label}</div>
            {meta.time && <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px' }}>{meta.time}</div>}
          </div>
        </div>
        {/* Kcal badge */}
        {option.kcal && (
          <div style={{ backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '6px', padding: '4px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#4ade80' }}>{option.kcal}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B' }}>KCAL</div>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      {options.length > 1 && (
        <div style={{ display: 'flex', padding: '10px 16px 0', gap: '6px' }}>
          {options.map((_, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ flex: 1, padding: '6px 4px', backgroundColor: tab === i ? '#4B5E4B' : '#0F110F', border: `1px solid ${tab === i ? '#4B5E4B' : '#2A302A'}`, borderRadius: '4px', color: tab === i ? '#fff' : '#8DA38D', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', letterSpacing: '1px', cursor: 'pointer' }}>
              OPÇÃO {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Meal content */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#ffffff', marginBottom: '4px', letterSpacing: '1px' }}>{option.nombre}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', marginBottom: '12px', lineHeight: 1.5 }}>{option.descripcion}</div>

        {/* Macros per meal */}
        {(option.proteina_g || option.carbos_g || option.grasa_g) && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            {[
              { label: 'PROT', value: option.proteina_g, color: '#4ade80', unit: 'g' },
              { label: 'CARB', value: option.carbos_g,  color: '#fbbf24', unit: 'g' },
              { label: 'GORD', value: option.grasa_g,   color: '#f87171', unit: 'g' },
            ].map((m, i) => m.value ? (
              <div key={i} style={{ flex: 1, backgroundColor: '#0F110F', borderRadius: '6px', padding: '6px', textAlign: 'center', border: '1px solid #2A302A' }}>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: m.color }}>{m.value}{m.unit}</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '0.5px' }}>{m.label}</div>
              </div>
            ) : null)}
          </div>
        )}

        {/* Ingredient chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(option.ingredientes || []).map((ing, idx) => (
            <span key={idx} style={{ backgroundColor: '#0F110F', border: '1px solid #2A302A', borderRadius: '4px', padding: '3px 9px', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#8DA38D' }}>
              {ing}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Shopping list ────────────────────────────────────────────────────────────
function ShoppingList({ plan }) {
  const allIngredients = []
  const meals = plan.comidas || {}
  Object.values(meals).forEach(options => {
    if (!Array.isArray(options)) return
    options.forEach(opt => {
      (opt.ingredientes || []).forEach(ing => {
        if (!allIngredients.includes(ing)) allIngredients.push(ing)
      })
    })
  })

  const [checked, setChecked] = useState({})
  const toggle = (ing) => setChecked(prev => ({ ...prev, [ing]: !prev[ing] }))

  return (
    <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '14px' }}>🛒 LISTA DE COMPRAS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {allIngredients.map((ing, i) => (
          <div key={i} onClick={() => toggle(ing)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', opacity: checked[ing] ? 0.4 : 1, transition: 'opacity 0.2s' }}>
            <div style={{ width: 18, height: 18, borderRadius: '3px', border: `1px solid ${checked[ing] ? '#4B5E4B' : '#2A302A'}`, backgroundColor: checked[ing] ? '#4B5E4B' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>
              {checked[ing] ? '✓' : ''}
            </div>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', textDecoration: checked[ing] ? 'line-through' : 'none' }}>{ing}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Supplement cards ─────────────────────────────────────────────────────────
const SUPPLEMENTS = [
  {
    id: 'batido', icon: '⚡', color: '#fbbf24',
    title: 'BATIDO DE PÓLVORA',
    subtitle: 'PRE-COMBATE',
    desc: 'Mezcla explosiva para máxima vascularización.',
    detail: '🥤 Remolacha (200ml) + jugo de zanahoria (100ml) + jengibre rallado (1cm).\n⏱ Tomar 30-45 min antes del entrenamiento para máximo bombeo.',
    timing: '30-45 min ANTES',
  },
  {
    id: 'nocturna', icon: '🌙', color: '#8b5cf6',
    title: 'RACIÓN NOCTURNA',
    subtitle: 'RECUPERACIÓN',
    desc: 'Protocolo nocturno para optimizar hormonas y quema de grasa.',
    detail: '🥩 200g carne roja magra o 3 huevos + ½ aguacate + 100g camote.\n⏱ Consumir 1-2h antes de dormir para máxima recuperación.',
    timing: '1-2h ANTES DORMIR',
  },
  {
    id: 'clandestinos', icon: '🛡️', color: '#4ade80',
    title: 'ALIMENTOS CLANDESTINOS',
    subtitle: 'ÉLITE',
    desc: 'Alimentos baratos y densos que la industria ignora.',
    detail: '• Hígado de res  • Sardinas enlatadas\n• Huevo entero  • Lentejas\n• Semillas de calabaza  • Avena integral\n• Ajo crudo  • Cúrcuma con pimienta negra',
    timing: 'DIARIAMENTE',
  },
]

function SupplementCard({ card }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div onClick={() => setExpanded(e => !e)} style={{ backgroundColor: '#1A1D1A', border: `1px solid ${expanded ? card.color + '55' : '#2A302A'}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ height: '3px', backgroundColor: card.color }} />
      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '26px' }}>{card.icon}</span>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', padding: '2px 6px', borderRadius: '3px', backgroundColor: card.color + '18', color: card.color, border: `1px solid ${card.color}44`, letterSpacing: '0.5px' }}>{card.timing}</span>
        </div>
        <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '12px', color: '#ffffff', letterSpacing: '1px', marginBottom: '2px' }}>{card.title}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px', marginBottom: '8px' }}>{card.subtitle}</div>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', lineHeight: 1.4 }}>{card.desc}</div>
        <div style={{ marginTop: '10px', fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: expanded ? card.color : '#4B5E4B', letterSpacing: '1px', borderTop: '1px solid #2A302A', paddingTop: '8px' }}>
          {expanded ? '▲ FECHAR' : '▼ VER DETALHES'}
        </div>
      </div>
      {expanded && (
        <div style={{ backgroundColor: '#0F110F', borderTop: `1px solid ${card.color}33`, padding: '14px 16px' }}>
          <pre style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
            {card.detail}
          </pre>
        </div>
      )}
    </div>
  )
}

// ── Config modal ─────────────────────────────────────────────────────────────
function ConfigModal({ profile, form, setForm, onClose, onGenerate, loading, error }) {
  const Label = ({ children }) => (
    <label style={{ display: 'block', fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '1px', marginBottom: '5px' }}>
      {children}
    </label>
  )
  const FieldWrap = ({ children }) => (
    <div style={{ marginBottom: '12px' }}>{children}</div>
  )
  const inputStyle = { width: '100%', backgroundColor: '#0F110F', border: '1px solid #2A302A', borderRadius: '6px', padding: '10px 12px', color: '#e5e7eb', fontFamily: '"Share Tech Mono", monospace', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '14px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, backgroundColor: '#0F110F', border: '1px solid #2A302A', borderRadius: '50%', color: '#8DA38D', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🍴</div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#fff', letterSpacing: '1px', marginBottom: '4px' }}>CONFIGURAR PLANO</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px' }}>A IA CALCULARÁ SEUS REQUERIMENTOS EXATOS</div>
        </div>

        {/* Read-only profile data */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'PESO ATUAL', value: `${profile?.weight || '—'} kg` },
            { label: 'OBJETIVO', value: `${profile?.targetWeight || '—'} kg` },
            { label: 'ALTURA', value: `${profile?.height || '—'} cm` },
            { label: 'BIÓTIPO', value: profile?.bodyType || '—' },
          ].map(row => (
            <div key={row.label} style={{ backgroundColor: '#0F110F', border: '1px solid #2A302A', borderRadius: '6px', padding: '10px 12px' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#4B5E4B', letterSpacing: '1px', marginBottom: '3px' }}>{row.label}</div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#8DA38D' }}>{row.value}</div>
            </div>
          ))}
        </div>

        {/* Editable inputs */}
        <FieldWrap>
          <Label>SEXO *</Label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['MASCULINO', 'FEMININO'].map(s => (
              <button key={s} onClick={() => setForm(f => ({ ...f, sex: s }))} style={{ flex: 1, padding: '9px', backgroundColor: form.sex === s ? '#4B5E4B' : '#0F110F', border: `1px solid ${form.sex === s ? '#4B5E4B' : '#2A302A'}`, borderRadius: '6px', color: form.sex === s ? '#fff' : '#8DA38D', fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                {s}
              </button>
            ))}
          </div>
        </FieldWrap>

        <FieldWrap>
          <Label>IDADE *</Label>
          <input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Ex: 25" style={inputStyle} />
        </FieldWrap>

        <FieldWrap>
          <Label>NÍVEL DE ATIVIDADE *</Label>
          <select value={form.activity} onChange={e => setForm(f => ({ ...f, activity: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="sedentario">Sedentário (sem exercício)</option>
            <option value="leve">Leve (1-2x por semana)</option>
            <option value="moderado">Moderado (3-5x por semana)</option>
            <option value="intenso">Intenso (6-7x por semana)</option>
            <option value="atleta">Atleta (2x por dia)</option>
          </select>
        </FieldWrap>

        <FieldWrap>
          <Label>OBJETIVO PRINCIPAL *</Label>
          <select value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="perda_gordura">Perda de gordura</option>
            <option value="ganho_muscular">Ganho muscular</option>
            <option value="recomposicao">Recomposição corporal</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </FieldWrap>

        <FieldWrap>
          <Label>ALERGIAS / RESTRIÇÕES (OPCIONAL)</Label>
          <input type="text" value={form.restrictions} onChange={e => setForm(f => ({ ...f, restrictions: e.target.value }))} placeholder="ex: sem lactose, vegetariano..." style={inputStyle} />
        </FieldWrap>

        {error && (
          <div style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '6px', padding: '10px 14px', marginBottom: '14px', fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#f87171' }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={onGenerate} disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: loading ? '#2A302A' : '#4B5E4B', border: 'none', borderRadius: '8px', color: loading ? '#8DA38D' : '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '15px', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          {loading ? (
            <><div style={{ width: 16, height: 16, border: '2px solid #8DA38D', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />GERANDO PLANO...</>
          ) : '⚡ GERAR PLANO TÁTICO'}
        </button>
      </div>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function NutritionModal({ approved, onClose, userEmail, profile }) {
  const cacheKey = `${PLAN_CACHE_KEY}_${userEmail || 'guest'}`

  const [form, setForm] = useState({ age: '', sex: 'MASCULINO', activity: 'moderado', goal: 'perda_gordura', restrictions: '' })
  const [configOpen, setConfigOpen]         = useState(false)
  const [loading, setLoading]               = useState(false)
  const [plan, setPlan]                     = useState(() => { try { const s = localStorage.getItem(cacheKey); return s ? JSON.parse(s) : null } catch { return null } })
  const [planRaw, setPlanRaw]               = useState(null)
  const [error, setError]                   = useState('')
  const [activeTab, setActiveTab]           = useState('plan') // 'plan' | 'supplements' | 'shopping'

  useEffect(() => {
    if (plan) localStorage.setItem(cacheKey, JSON.stringify(plan))
  }, [plan])

  if (!approved) return <UpsellScreen onClose={onClose} />

  const handleGenerate = async () => {
    if (!form.age) { setError('Informe sua idade para gerar o plano.'); return }
    if (!form.sex) { setError('Selecione seu sexo.'); return }
    setLoading(true); setError(''); setPlanRaw(null); setPlan(null)

    const weight = profile?.weight || '—'
    const height = profile?.height || '—'
    const targetWeight = profile?.targetWeight || '—'

    const activityMap = { sedentario: 'sedentário (fator 1.2)', leve: 'levemente ativo (fator 1.375)', moderado: 'moderadamente ativo (fator 1.55)', intenso: 'muito ativo (fator 1.725)', atleta: 'extremamente ativo (fator 1.9)' }
    const goalMap = { perda_gordura: 'perda de gordura (déficit de 300-400kcal)', ganho_muscular: 'ganho muscular (superávit de 200-300kcal)', recomposicao: 'recomposição corporal (calorias de manutenção)', manutencao: 'manutenção de peso' }

    const prompt = `Eres un nutricionista deportivo experto en calistenia militar. Crea un plan nutricional completo en español latinoamericano.

Datos del operativo:
- Sexo: ${form.sex}
- Peso actual: ${weight} kg
- Altura: ${height} cm
- Edad: ${form.age} años
- Peso objetivo: ${targetWeight} kg
- Nivel de actividad: ${activityMap[form.activity]}
- Objetivo: ${goalMap[form.goal]}
- Restricciones/alergias: ${form.restrictions || 'ninguna'}

Instrucciones:
1. Calcula TMB con fórmula Mifflin-St Jeor (hombre: 10*peso + 6.25*altura - 5*edad + 5 / mujer: 10*peso + 6.25*altura - 5*edad - 161)
2. Ajusta por nivel de actividad y objetivo
3. Distribuye macros: proteína 2g/kg para calistenia, carbos y grasas según calorías restantes
4. Calcula agua diaria: peso_kg * 0.035 litros
5. Crea 4 comidas con 2 opciones cada una, todas con macros individuales

Retorna ÚNICAMENTE JSON puro (sin markdown, sin texto extra):
{
  "calorias": 2200,
  "proteina": 160,
  "carbos": 240,
  "gordura": 70,
  "agua_litros": 2.8,
  "tmb": 1820,
  "comidas": {
    "desayuno": [
      {"nombre":"Nombre","descripcion":"Desc breve","kcal":450,"proteina_g":35,"carbos_g":45,"grasa_g":12,"ingredientes":["item 1 - cantidad","item 2 - cantidad"]},
      {"nombre":"Nombre","descripcion":"Desc breve","kcal":420,"proteina_g":30,"carbos_g":50,"grasa_g":10,"ingredientes":["item 1 - cantidad"]}
    ],
    "merienda": [
      {"nombre":"","descripcion":"","kcal":200,"proteina_g":20,"carbos_g":20,"grasa_g":5,"ingredientes":["..."]},
      {"nombre":"","descripcion":"","kcal":180,"proteina_g":18,"carbos_g":18,"grasa_g":4,"ingredientes":["..."]}
    ],
    "almuerzo": [
      {"nombre":"","descripcion":"","kcal":650,"proteina_g":55,"carbos_g":70,"grasa_g":18,"ingredientes":["..."]},
      {"nombre":"","descripcion":"","kcal":600,"proteina_g":50,"carbos_g":65,"grasa_g":16,"ingredientes":["..."]}
    ],
    "cena": [
      {"nombre":"","descripcion":"","kcal":500,"proteina_g":45,"carbos_g":40,"grasa_g":14,"ingredientes":["..."]},
      {"nombre":"","descripcion":"","kcal":480,"proteina_g":42,"carbos_g":38,"grasa_g":13,"ingredientes":["..."]}
    ]
  }
}`

    try {
      const res  = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.6, maxOutputTokens: 3000 } }),
      })
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) { setError('Error al generar. Intenta de nuevo.'); setLoading(false); return }

      try {
        const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
        const parsed  = JSON.parse(cleaned)
        setPlan(parsed)
        setActiveTab('plan')
      } catch {
        setPlanRaw(text)
      }
      setConfigOpen(false)
    } catch {
      setError('Error de conexión. Verifica tu internet.')
    }
    setLoading(false)
  }

  const TABS = [
    { id: 'plan',        label: '📋 PLANO' },
    { id: 'supplements', label: '⚡ ARSENAL' },
    ...(plan ? [{ id: 'shopping', label: '🛒 COMPRAS' }] : []),
  ]

  const mealOrder = ['desayuno', 'merienda', 'almuerzo', 'cena']

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: '#0F110F', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={{ backgroundColor: 'transparent', border: 'none', color: '#8DA38D', fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px', padding: 0 }}>
          ← VOLVER
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>🥗</span>
          <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '15px', color: '#8DA38D', letterSpacing: '1px' }}>NUTRICIÓN TÁCTICA</span>
        </div>
        <button onClick={() => { setConfigOpen(true); setError('') }} style={{ backgroundColor: '#4B5E4B', border: 'none', borderRadius: '6px', padding: '6px 12px', color: '#fff', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', cursor: 'pointer', letterSpacing: '1px' }}>
          {plan ? '🔄 NUEVO' : '⚡ GERAR'}
        </button>
      </div>

      <div style={{ padding: '16px', maxWidth: '700px', margin: '0 auto' }}>

        {/* GENERAR card (only if no plan) */}
        {!plan && !planRaw && (
          <div onClick={() => setConfigOpen(true)} style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderLeft: '4px solid #4B5E4B', borderRadius: '10px', padding: '18px', marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e221e'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1A1D1A'}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse-green 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px' }}>IA ACTIVA // CLICK AQUÍ</span>
              </div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '20px', color: '#fff', letterSpacing: '2px' }}>GERAR PLANO TÁTICO</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', marginTop: '4px' }}>Dieta personalizada com macros por refeição</div>
            </div>
            <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '28px', color: '#4B5E4B' }}>›</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: '9px 6px', backgroundColor: activeTab === t.id ? '#4B5E4B' : '#1A1D1A', border: `1px solid ${activeTab === t.id ? '#4B5E4B' : '#2A302A'}`, borderRadius: '7px', color: activeTab === t.id ? '#fff' : '#8DA38D', fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.5px' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: PLAN ── */}
        {activeTab === 'plan' && (
          <>
            {plan && (
              <>
                <HeroStats plan={plan} profile={profile} />
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '12px', textAlign: 'center' }}>// REFEIÇÕES DO DIA //</div>
                {mealOrder.map(key => plan.comidas?.[key]?.length ? (
                  <MealSection key={key} mealKey={key} options={plan.comidas[key]} />
                ) : null)}
              </>
            )}
            {planRaw && (
              <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '8px', padding: '16px' }}>
                <pre style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{planRaw}</pre>
              </div>
            )}
            {!plan && !planRaw && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>🥗</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#4B5E4B' }}>Gera tu plan personalizado para verlo aquí</div>
              </div>
            )}
          </>
        )}

        {/* ── TAB: SUPPLEMENTS ── */}
        {activeTab === 'supplements' && (
          <>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#fff', textAlign: 'center', letterSpacing: '2px', marginBottom: '4px' }}>ARSENAL SUPLEMENTARIO</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', textAlign: 'center', letterSpacing: '2px', marginBottom: '16px' }}>PROTOCOLOS DE FUERZAS ESPECIALES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SUPPLEMENTS.map(c => <SupplementCard key={c.id} card={c} />)}
            </div>
          </>
        )}

        {/* ── TAB: SHOPPING ── */}
        {activeTab === 'shopping' && plan && <ShoppingList plan={plan} />}

        <button onClick={onClose} style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', border: '1px solid #2A302A', borderRadius: '6px', color: '#4B5E4B', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', cursor: 'pointer', marginTop: '16px', marginBottom: '32px' }}>
          ← VOLVER AL CUARTEL
        </button>
      </div>

      {configOpen && (
        <ConfigModal profile={profile} form={form} setForm={setForm}
          onClose={() => { setConfigOpen(false); setError('') }}
          onGenerate={handleGenerate} loading={loading} error={error} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-green { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      `}</style>
    </div>
  )
}
