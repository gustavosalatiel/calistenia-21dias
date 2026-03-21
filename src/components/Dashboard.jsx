import { useState, useEffect } from 'react'

// ⚙️ Configure seus links de checkout da Kiwify aqui
const CHECKOUT_URLS = {
  nutrition:    'https://pay.kiwify.com.br/SEU-LINK-NUTRICAO',
  sleep:        'https://pay.kiwify.com.br/SEU-LINK-SONO',
  presidential: 'https://pay.kiwify.com.br/SEU-LINK-PRESIDENCIAL',
}

const typeColors = {
  FUERZA: { bg: 'rgba(75,94,75,0.2)', text: '#8DA38D', border: '#4B5E4B' },
  HIIT:   { bg: 'rgba(220,38,38,0.15)', text: '#f87171', border: '#dc2626' },
  MIXTO:  { bg: 'rgba(234,179,8,0.15)', text: '#fbbf24', border: '#d97706' },
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

function DifficultyFlames({ level, size = 12 }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= level ? 1 : 0.2, fontSize: size }}>🔥</span>
      ))}
    </span>
  )
}

function DayCell({ workout, isCompleted, isNext, isLocked, onSelect, size = 'sm' }) {
  const colors = typeColors[workout.type] || typeColors.MIXTO
  const isMd = size === 'md'
  return (
    <button
      onClick={() => !isLocked && onSelect(workout)}
      title={isLocked ? `Completa el Día ${workout.day - 1} para desbloquear` : workout.protocolName}
      style={{
        backgroundColor: isLocked ? '#111311'
          : isCompleted ? 'rgba(75,94,75,0.3)'
          : isNext ? 'rgba(75,94,75,0.15)'
          : '#1A1D1A',
        border: isLocked ? '1px solid #1A1D1A'
          : isNext ? '1px solid #4B5E4B'
          : isCompleted ? '1px solid rgba(75,94,75,0.5)'
          : '1px solid #2A302A',
        borderRadius: '6px',
        padding: isMd ? '10px 8px' : '8px 6px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '4px', position: 'relative',
        minHeight: isMd ? '76px' : '64px',
        justifyContent: 'center',
        opacity: isLocked ? 0.45 : 1,
      }}
    >
      {isCompleted && !isLocked && (
        <div style={{ position: 'absolute', top: 3, right: 3, width: 14, height: 14, backgroundColor: '#4B5E4B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff' }}>✓</div>
      )}
      {isLocked && (
        <div style={{ position: 'absolute', top: 3, right: 3, fontSize: '9px' }}>🔒</div>
      )}
      <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: isMd ? '13px' : '11px', color: isLocked ? '#3a3a3a' : isCompleted ? '#8DA38D' : isNext ? '#fff' : '#8DA38D' }}>
        D{workout.day}
      </div>
      {isLocked ? (
        <div style={{ fontSize: '9px', fontFamily: '"Share Tech Mono", monospace', color: '#2A302A' }}>—</div>
      ) : (
        <div style={{ fontSize: '9px', fontFamily: '"Share Tech Mono", monospace', color: colors.text, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '2px', padding: '1px 4px', letterSpacing: '0.5px' }}>{workout.type}</div>
      )}
      {!isLocked && (
        <div>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ opacity: i <= workout.difficulty ? 1 : 0.2, fontSize: isMd ? '9px' : '8px' }}>🔥</span>
          ))}
        </div>
      )}
    </button>
  )
}

// Card de módulo com controle de acesso verde/vermelho
function ModuleCard({ card, isDesktop }) {
  const { approved, requiresApproval, checkoutUrl, onClick, icon, title, subtitle, desc, color } = card
  const locked = requiresApproval && !approved

  const handleClick = () => {
    if (locked) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
    } else {
      onClick()
    }
  }

  const borderColor  = locked ? 'rgba(220,38,38,0.45)' : (approved && requiresApproval) ? 'rgba(75,94,75,0.65)' : '#2A302A'
  const glowColor    = locked ? 'rgba(220,38,38,0.06)' : (approved && requiresApproval) ? 'rgba(75,94,75,0.08)' : 'transparent'
  const accentColor  = locked ? '#dc2626' : (approved && requiresApproval) ? '#4B5E4B' : color

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: '#1A1D1A',
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: isDesktop ? '18px 16px' : '16px 12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        boxShadow: `0 0 16px ${glowColor}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = locked ? 'rgba(220,38,38,0.75)' : '#4B5E4B'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = borderColor
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Accent bar top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: accentColor }} />

      {/* Status badge */}
      {requiresApproval && (
        <div style={{
          position: 'absolute', top: 10, right: 8,
          fontSize: '8px', fontFamily: '"Share Tech Mono", monospace',
          padding: '2px 7px', borderRadius: '3px',
          backgroundColor: locked ? 'rgba(220,38,38,0.12)' : 'rgba(75,94,75,0.18)',
          color: locked ? '#f87171' : '#4ade80',
          border: `1px solid ${locked ? 'rgba(220,38,38,0.3)' : 'rgba(75,94,75,0.35)'}`,
          letterSpacing: '0.5px',
        }}>
          {locked ? '🔒 BLOQUEADO' : '✓ ATIVO'}
        </div>
      )}

      <div style={{ fontSize: isDesktop ? '28px' : '24px', marginBottom: '8px', filter: locked ? 'grayscale(0.6)' : 'none' }}>
        {icon}
      </div>

      <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: isDesktop ? '13px' : '12px', color: locked ? '#5a5a5a' : '#ffffff', lineHeight: 1.2 }}>
        {title}
      </div>
      <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: isDesktop ? '13px' : '12px', color: locked ? '#444' : '#8DA38D', lineHeight: 1.2, marginBottom: '6px' }}>
        {subtitle}
      </div>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: locked ? '#3a3a3a' : '#4B5E4B', lineHeight: 1.4, marginBottom: locked ? '10px' : '0' }}>
        {desc}
      </div>

      {locked && (
        <div style={{ marginTop: '8px', backgroundColor: '#dc2626', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '10px', padding: '7px 10px', borderRadius: '4px', textAlign: 'center', letterSpacing: '1px' }}>
          DESBLOQUEAR →
        </div>
      )}
    </button>
  )
}

function NavBtn({ icon, label, onClick, dot }) {
  return (
    <button onClick={onClick} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', gap: '3px', position: 'relative' }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      {dot && (
        <div style={{
          position: 'absolute', top: 8, right: '50%', marginRight: '-16px',
          width: 7, height: 7, borderRadius: '50%',
          backgroundColor: dot === 'red' ? '#dc2626' : '#4ade80',
          border: '1.5px solid #151715',
          boxShadow: dot === 'red' ? '0 0 4px #dc2626' : '0 0 4px #4ade80',
        }} />
      )}
      <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '0.5px' }}>{label}</span>
    </button>
  )
}

export default function Dashboard({
  workouts, completedDays, userEmail, profile, nextDay,
  onSelectDay, onOpenNutrition, onOpenSleep, onOpenBonus, onOpenMaya,
  onOpenProfile, onStartDay,
  nutritionApproved, sleepApproved, presidentialApproved,
}) {
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 768
  const progress = Math.round((completedDays.length / 21) * 100)
  const displayName = profile?.name || userEmail?.split('@')[0]?.toUpperCase() || 'OPERATIVO'

  const featureCards = [
    {
      id: 'nutrition', icon: '🥗', title: 'NUTRICIÓN', subtitle: 'TÁCTICA',
      desc: 'Dieta personalizada por IA para tu objetivo',
      color: '#4B5E4B', approved: nutritionApproved, requiresApproval: true,
      checkoutUrl: CHECKOUT_URLS.nutrition, onClick: onOpenNutrition,
    },
    {
      id: 'sleep', icon: '🌙', title: 'PROTOCOLO', subtitle: 'DE SUEÑO',
      desc: 'Optimiza tu recuperación y sueño profundo',
      color: '#4a4b6b', approved: sleepApproved, requiresApproval: true,
      checkoutUrl: CHECKOUT_URLS.sleep, onClick: onOpenSleep,
    },
    {
      id: 'presidential', icon: '🏆', title: 'PROTOCOLO', subtitle: 'PRESIDENCIAL',
      desc: 'Material exclusivo de élite — PDFs tácticos',
      color: '#6b4a1a', approved: presidentialApproved, requiresApproval: true,
      checkoutUrl: CHECKOUT_URLS.presidential, onClick: onOpenBonus,
    },
    {
      id: 'maya', icon: '💬', title: 'MAYA IA', subtitle: 'INSTRUCTORA',
      desc: 'Tu asistente táctica personal 24/7',
      color: '#2a4b6b', approved: true, requiresApproval: false,
      checkoutUrl: '', onClick: onOpenMaya,
    },
  ]

  // ─── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div style={{ backgroundColor: '#0F110F', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Top nav */}
        <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '10px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '3px' }}>SISTEMA OPERATIVO</div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '20px', color: '#8DA38D' }}>DESAFÍO 21 DÍAS</div>
            </div>
            <div style={{ width: 1, height: 36, backgroundColor: '#2A302A' }} />
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>
              OPERATIVO: <span style={{ color: '#8DA38D' }}>{displayName}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Module status pills */}
            {featureCards.filter(c => c.requiresApproval).map(c => (
              <div key={c.id} onClick={c.approved ? c.onClick : () => window.open(c.checkoutUrl, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', backgroundColor: c.approved ? 'rgba(75,94,75,0.15)' : 'rgba(220,38,38,0.1)', border: `1px solid ${c.approved ? 'rgba(75,94,75,0.4)' : 'rgba(220,38,38,0.3)'}`, transition: 'all 0.2s' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.approved ? '#4ade80' : '#dc2626', boxShadow: c.approved ? '0 0 4px #4ade80' : '0 0 4px #dc2626' }} />
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: c.approved ? '#4ade80' : '#f87171', letterSpacing: '1px' }}>
                  {c.subtitle}
                </span>
                {!c.approved && <span style={{ fontSize: '8px' }}>🔒</span>}
              </div>
            ))}
            <div style={{ width: 1, height: 30, backgroundColor: '#2A302A' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>PROGRESO</div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '20px', color: '#8DA38D', lineHeight: 1 }}>{progress}%</div>
            </div>
            <button onClick={onOpenProfile} style={{ width: 38, height: 38, borderRadius: '50%', backgroundColor: '#1A1D1A', border: '1px solid #2A302A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer' }}>👤</button>
          </div>
        </div>

        {/* 2-column body */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', maxWidth: '1600px', width: '100%', margin: '0 auto', padding: '24px 32px', gap: '0' }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ paddingRight: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Hero Progress */}
            <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 150, height: 150, background: 'radial-gradient(circle, rgba(75,94,75,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '4px' }}>BIENVENIDO, OPERATIVO</div>
                  <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '24px', color: '#ffffff' }}>{displayName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>DÍAS COMPLETADOS</div>
                  <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '34px', color: '#8DA38D', lineHeight: 1 }}>
                    {completedDays.length}<span style={{ fontSize: '16px', color: '#4B5E4B' }}>/21</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>PROGRESO DE MISIÓN</span>
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#8DA38D' }}>{progress}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#0F110F', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#4B5E4B', borderRadius: '3px', transition: 'width 0.5s ease', boxShadow: '0 0 8px rgba(75,94,75,0.6)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[{ label: 'COMPLETADOS', value: completedDays.length }, { label: 'RESTANTES', value: 21 - completedDays.length }, { label: 'PRÓXIMO DÍA', value: `D${nextDay.day}` }].map((s, i) => (
                  <div key={i} style={{ backgroundColor: '#0F110F', borderRadius: '6px', padding: '10px', textAlign: 'center', border: '1px solid #2A302A' }}>
                    <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#8DA38D' }}>{s.value}</div>
                    <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '0.5px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Mission */}
            <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #4B5E4B', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }} onClick={() => onSelectDay(nextDay)}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${nextDay.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
              <div style={{ position: 'relative', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '2px' }}>MISIÓN ACTIVA</div>
                    <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '11px', color: '#8DA38D' }}>{nextDay.operationCode}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', backgroundColor: typeColors[nextDay.type]?.bg || 'rgba(75,94,75,0.2)', color: typeColors[nextDay.type]?.text || '#8DA38D', border: `1px solid ${typeColors[nextDay.type]?.border || '#4B5E4B'}`, padding: '2px 8px', borderRadius: '3px' }}>{nextDay.type}</div>
                    <DifficultyFlames level={nextDay.difficulty} />
                  </div>
                </div>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '20px', color: '#ffffff', marginBottom: '8px' }}>DÍA {nextDay.day}: {nextDay.protocolName}</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', marginBottom: '14px', lineHeight: 1.5 }}>{nextDay.missionReport}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>⏱ {nextDay.duration} MIN</span>
                    <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>💪 {nextDay.exercises.length} EJERCICIOS</span>
                  </div>
                  <div style={{ backgroundColor: '#4B5E4B', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '12px', padding: '8px 18px', borderRadius: '4px', letterSpacing: '1px' }}>INICIAR ▶</div>
                </div>
              </div>
            </div>

            {/* Maya quick access */}
            <button onClick={onOpenMaya} style={{ backgroundColor: '#0d1a26', border: '1px solid #1e3a52', borderRadius: '10px', padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2a5a8b'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e3a52'}
            >
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #0d2035 0%, #1a3a52 100%)', border: '2px solid #2a5a8b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, position: 'relative' }}>
                💪
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, backgroundColor: '#4ade80', borderRadius: '50%', border: '2px solid #0d1a26', boxShadow: '0 0 6px #4ade80' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '17px', color: '#fff' }}>MAYA IA</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '1px' }}>INSTRUCTORA TÁCTICA · EN LÍNEA</div>
              </div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#3a7abf' }}>CHAT →</div>
            </button>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ borderLeft: '1px solid #1e221e', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Modules */}
            <div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '12px' }}>MÓDULOS DO PROGRAMA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {featureCards.filter(c => c.id !== 'maya').map(card => (
                  <ModuleCard key={card.id} card={card} isDesktop={true} />
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>CALENDARIO TÁCTICO</span>
                <span style={{ color: '#8DA38D' }}>{completedDays.length}/21 DÍAS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {workouts.map(workout => {
                  const isCompleted = completedDays.includes(workout.day)
                  const isNext = workout.day === nextDay.day && !isCompleted
                  const isLocked = workout.day > 1 && !completedDays.includes(workout.day - 1)
                  return <DayCell key={workout.day} workout={workout} isCompleted={isCompleted} isNext={isNext} isLocked={isLocked} onSelect={onSelectDay} size="md" />
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {Object.entries(typeColors).map(([type, colors]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '2px' }} />
                  <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: colors.text }}>{type}</span>
                </div>
              ))}
            </div>

            {/* Start CTA */}
            <button onClick={onStartDay} style={{ backgroundColor: '#4B5E4B', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '16px', padding: '16px', borderRadius: '8px', border: '1px solid #8DA38D', cursor: 'pointer', letterSpacing: '2px', boxShadow: '0 0 24px rgba(75,94,75,0.35)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#5a7a5a'; e.currentTarget.style.boxShadow = '0 0 32px rgba(75,94,75,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#4B5E4B'; e.currentTarget.style.boxShadow = '0 0 24px rgba(75,94,75,0.35)' }}
            >
              ▶ INICIAR DÍA {nextDay.day}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── MOBILE LAYOUT ───────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: '#0F110F', minHeight: '100vh', paddingBottom: '80px', maxWidth: '480px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '3px' }}>SISTEMA OPERATIVO</div>
          <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '16px', color: '#8DA38D' }}>DESAFÍO 21 DÍAS</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>PROGRESO</div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#8DA38D' }}>{progress}%</div>
          </div>
          <button onClick={onOpenProfile} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1A1D1A', border: '1px solid #2A302A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer' }}>👤</button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Hero Progress */}
        <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '10px', padding: '20px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: 'radial-gradient(circle, rgba(75,94,75,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '2px' }}>BIENVENIDO, OPERATIVO</div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '20px', color: '#ffffff' }}>{displayName}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>DÍAS COMPLETADOS</div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '28px', color: '#8DA38D', lineHeight: 1 }}>
                {completedDays.length}<span style={{ fontSize: '14px', color: '#4B5E4B' }}>/21</span>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>PROGRESO DE MISIÓN</span>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#8DA38D' }}>{progress}%</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#0F110F', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#4B5E4B', borderRadius: '3px', transition: 'width 0.5s ease', boxShadow: '0 0 8px rgba(75,94,75,0.6)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[{ label: 'COMPLETADOS', value: completedDays.length }, { label: 'RESTANTES', value: 21 - completedDays.length }, { label: 'PRÓXIMO DÍA', value: `D${nextDay.day}` }].map((stat, i) => (
              <div key={i} style={{ backgroundColor: '#0F110F', borderRadius: '6px', padding: '8px', textAlign: 'center', border: '1px solid #2A302A' }}>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '16px', color: '#8DA38D' }}>{stat.value}</div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Mission */}
        <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #4B5E4B', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', cursor: 'pointer', position: 'relative' }} onClick={() => onSelectDay(nextDay)}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${nextDay.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
          <div style={{ position: 'relative', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px', marginBottom: '2px' }}>MISIÓN ACTIVA</div>
                <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '11px', color: '#8DA38D' }}>{nextDay.operationCode}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', backgroundColor: typeColors[nextDay.type]?.bg || 'rgba(75,94,75,0.2)', color: typeColors[nextDay.type]?.text || '#8DA38D', border: `1px solid ${typeColors[nextDay.type]?.border || '#4B5E4B'}`, padding: '2px 8px', borderRadius: '3px' }}>{nextDay.type}</div>
                <DifficultyFlames level={nextDay.difficulty} />
              </div>
            </div>
            <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>DÍA {nextDay.day}: {nextDay.protocolName}</div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '11px', color: '#8DA38D', marginBottom: '14px', lineHeight: 1.5 }}>{nextDay.missionReport}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>⏱ {nextDay.duration} MIN</span>
                <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B' }}>💪 {nextDay.exercises.length} EJERCICIOS</span>
              </div>
              <div style={{ backgroundColor: '#4B5E4B', color: '#fff', fontFamily: '"Black Ops One", cursive', fontSize: '11px', padding: '8px 16px', borderRadius: '4px', letterSpacing: '1px' }}>INICIAR ▶</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '10px' }}>MÓDULOS DEL PROGRAMA</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {featureCards.map(card => <ModuleCard key={card.id} card={card} isDesktop={false} />)}
        </div>

        {/* Calendar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#4B5E4B', letterSpacing: '3px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>CALENDARIO TÁCTICO</span>
            <span style={{ color: '#8DA38D' }}>{completedDays.length}/21 DÍAS</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {workouts.map(workout => {
              const isCompleted = completedDays.includes(workout.day)
              const isNext = workout.day === nextDay.day && !isCompleted
              const isLocked = workout.day > 1 && !completedDays.includes(workout.day - 1)
              return <DayCell key={workout.day} workout={workout} isCompleted={isCompleted} isNext={isNext} isLocked={isLocked} onSelect={onSelectDay} size="sm" />
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {Object.entries(typeColors).map(([type, colors]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 8, height: 8, backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: '2px' }} />
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: colors.text }}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', backgroundColor: '#151715', borderTop: '1px solid #2A302A', display: 'flex', alignItems: 'center', zIndex: 40, padding: '0 4px' }}>
        <NavBtn icon="👤" label="PERFIL"    onClick={onOpenProfile} />
        <NavBtn icon="🥗" label="NUTRICIÓN" onClick={onOpenNutrition} dot={nutritionApproved ? 'green' : 'red'} />
        <button onClick={onStartDay} style={{ flex: 'none', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#4B5E4B', border: '3px solid #8DA38D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: '0 6px', boxShadow: '0 0 20px rgba(75,94,75,0.5)', gap: '1px', position: 'relative', top: '-10px' }}>
          <span style={{ fontSize: '20px' }}>▶</span>
          <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '7px', color: '#fff', letterSpacing: '0.5px' }}>INICIAR</span>
        </button>
        <NavBtn icon="🌙" label="SUEÑO"   onClick={onOpenSleep} dot={sleepApproved ? 'green' : 'red'} />
        <NavBtn icon="💬" label="MAYA"    onClick={onOpenMaya} />
      </div>
    </div>
  )
}
