import { useState, useEffect, useRef, useCallback } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL   = 'gemini-2.5-flash-lite'
const WELCOME_PLAYED_KEY = 'maya_welcome_played'

const MAYA_SYSTEM_PROMPT = `Eres Maya, la instructora del app de entrenamiento de 21 días de calistenia militar.
Hablas SOLO en español latinoamericano.
Eres como esa amiga fit que todos quieren tener: cercana, motivadora, directa y con mucho conocimiento.
Usas "soldado" o "recluta" de forma cariñosa cuando te diriges al usuario.
Hablas como persona normal, sin formalidades excesivas.
Corto y al punto - tus respuestas son concisas pero completas.
Puedes usar emoji para expresarte.
NUNCA uses asteriscos dobles (**) para formatear texto.
Cuando des listas, usa guiones (-) o números.
Eres experta en: calistenia, nutrición deportiva, recuperación, programación de entrenamiento, motivación.
El programa tiene 21 días de entrenamientos progresivos.`

// ── Utilities ────────────────────────────────────────────────────────────────
function fmtTime(s) {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 480)
  useEffect(() => {
    const h = () => setW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return w
}

// ── Waveform bars (decorative, matches the screenshot look) ──────────────────
function WaveformBars({ progress }) {
  const bars = [3,5,8,6,10,7,4,9,6,8,5,7,10,4,6,8,5,9,7,4,6,8,5,7,9,6,4,8,6,5]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '28px', flex: 1, cursor: 'pointer' }}>
      {bars.map((h, i) => {
        const pct = (i / bars.length) * 100
        const active = pct <= progress
        return (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${h * 2.2}px`,
              borderRadius: '2px',
              backgroundColor: active ? '#4ade80' : '#2A402A',
              transition: 'background-color 0.1s',
              flexShrink: 0,
            }}
          />
        )
      })}
    </div>
  )
}

// ── In-chat Audio Player (WhatsApp style) ────────────────────────────────────
function AudioPlayer({ src, autoPlay }) {
  const audioRef  = useRef(null)
  const [playing, setPlaying]         = useState(false)
  const [current, setCurrent]         = useState(0)
  const [duration, setDuration]       = useState(0)
  const [progress, setProgress]       = useState(0)   // 0-100
  const [loading, setLoading]         = useState(true)
  const progressBarRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setLoading(false)
    })
    audio.addEventListener('timeupdate', () => {
      setCurrent(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    })
    audio.addEventListener('play',  () => setPlaying(true))
    audio.addEventListener('pause', () => setPlaying(false))
    audio.addEventListener('ended', () => { setPlaying(false); setCurrent(0); setProgress(0); audio.currentTime = 0 })

    if (autoPlay) {
      audio.play().catch(() => {
        const unlock = () => { audio.play().catch(() => {}); document.removeEventListener('click', unlock); document.removeEventListener('touchstart', unlock) }
        document.addEventListener('click', unlock)
        document.addEventListener('touchstart', unlock)
      })
    }

    return () => { audio.pause(); audio.src = '' }
  }, [src, autoPlay])

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause() } else { a.play().catch(() => {}) }
  }

  const handleSeek = (e) => {
    const a = audioRef.current
    if (!a || !progressBarRef.current) return
    const rect = progressBarRef.current.getBoundingClientRect()
    const x    = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const pct  = Math.max(0, Math.min(1, x / rect.width))
    a.currentTime = pct * a.duration
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: '#1e251e',
      border: '1px solid #2A302A',
      borderRadius: '12px',
      padding: '10px 14px',
      minWidth: '220px',
      maxWidth: '280px',
    }}>
      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        style={{
          width: 38, height: 38, borderRadius: '50%',
          backgroundColor: '#4ade80',
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: '0 0 10px rgba(74,222,128,0.35)',
          fontSize: '14px',
          paddingLeft: playing ? '0' : '2px',
        }}
      >
        {playing
          ? <span style={{ color: '#0a1a0a', fontWeight: 'bold', fontSize: '13px' }}>⏸</span>
          : <span style={{ color: '#0a1a0a', fontWeight: 'bold', fontSize: '16px' }}>▶</span>
        }
      </button>

      {/* Waveform + time */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        {/* Waveform bar (clickable) */}
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          onTouchStart={handleSeek}
          style={{ cursor: 'pointer' }}
        >
          <WaveformBars progress={progress} />
        </div>

        {/* Time */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px', color: '#4B5E4B',
        }}>
          <span>{fmtTime(current)}</span>
          <span>{loading ? '--:--' : fmtTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '8px 12px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4B5E4B', animation: `bounce 1.2s ${i*0.2}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

// ── Maya avatar ──────────────────────────────────────────────────────────────
function MayaAvatar({ size = 40, showDot = false, imgOk, onError }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
      {imgOk
        ? <img src="/maya.png" alt="Maya" onError={onError} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4B5E4B', display: 'block' }} />
        : <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1a3a2a,#0d2a1a)', border: '2px solid #4B5E4B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4 }}>💪</div>
      }
      {showDot && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, backgroundColor: '#4ade80', borderRadius: '50%', border: '2px solid #151715', boxShadow: '0 0 6px #4ade80' }} />}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MayaChat({ onClose, userEmail }) {
  const STORAGE_KEY = `maya_chat_${userEmail || 'guest'}`
  const windowWidth = useWindowWidth()
  const isDesktop   = windowWidth >= 768

  // First open: auto-play the audio once ever
  const isFirstEver = !localStorage.getItem(WELCOME_PLAYED_KEY)

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [imgOk,   setImgOk]   = useState(true)
  const messagesEndRef = useRef(null)

  // Mark welcome as played on mount (only once ever)
  useEffect(() => {
    if (isFirstEver) localStorage.setItem(WELCOME_PLAYED_KEY, '1')
  }, [])

  // Welcome messages on very first open
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          type: 'text',
          content: '¡Hola recluta! Soy Maya. Aquí estoy para que no te rindas. ¿Qué te trae por aquí? ¿Dudas, dolor o necesitas un empujón? 💪',
          timestamp: Date.now(),
        },
        {
          role: 'assistant',
          type: 'audio',
          src: '/maya-bienvenido.mp3',
          timestamp: Date.now() + 1,
        },
      ])
    }
  }, [])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Persist
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
    }
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg   = { role: 'user', type: 'text', content: text, timestamp: Date.now() }
    const newMsgs   = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      // Only pass text messages to Gemini (ignore audio entries)
      const contents = newMsgs
        .filter(m => m.type === 'text')
        .slice(-20)
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))

      const res  = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system_instruction: { parts: [{ text: MAYA_SYSTEM_PROMPT }] }, contents, generationConfig: { temperature: 0.9, maxOutputTokens: 800 } }) }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text

      setMessages(prev => [...prev, {
        role: 'assistant', type: 'text',
        content: reply || 'Lo siento soldado, tuve un problema de conexión. ¿Puedes repetir tu pregunta? 🔄',
        timestamp: Date.now(),
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', type: 'text', content: 'Hay un problema de conexión ahora mismo. Intenta en un momento, recluta 💪', timestamp: Date.now() }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setMessages([
      { role: 'assistant', type: 'text', content: '¡Historial limpio, soldado! 🧹 ¿En qué te puedo ayudar hoy? 💪', timestamp: Date.now() },
      { role: 'assistant', type: 'audio', src: '/maya-bienvenido.mp3', timestamp: Date.now() + 1 },
    ])
  }

  const quickPrompts = ['¿Cómo mejorar mis pull-ups?','¿Qué comer antes de entrenar?','¿Cómo recuperarme más rápido?','Tips para el Día 1']

  const containerStyle = isDesktop ? {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    width: '640px', maxHeight: '84vh', zIndex: 50,
    backgroundColor: '#0F110F', display: 'flex', flexDirection: 'column',
    borderRadius: '14px', border: '1px solid #2A302A',
    boxShadow: '0 24px 64px rgba(0,0,0,0.75)', overflow: 'hidden',
  } : {
    position: 'fixed', inset: 0, zIndex: 50,
    backgroundColor: '#0F110F', display: 'flex', flexDirection: 'column',
    maxWidth: '480px', margin: '0 auto',
  }

  return (
    <>
      {isDesktop && <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 49 }} onClick={onClose} />}

      <div style={containerStyle}>

        {/* ── Header ── */}
        <div style={{ backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MayaAvatar size={46} showDot imgOk={imgOk} onError={() => setImgOk(false)} />
            <div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '17px', color: '#fff', letterSpacing: '1px' }}>MAYA</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px' }}>
                EN LÍNEA // MANDO ACTIVO
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleClearHistory} title="Limpiar historial" style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>🗑️</button>
            <button onClick={onClose} style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8DA38D', fontSize: '16px' }}>✕</button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end', animation: 'fadeInMsg 0.3s ease-out' }}>
              {/* Avatar only on assistant messages */}
              {msg.role === 'assistant' && (
                <MayaAvatar size={28} imgOk={imgOk} onError={() => setImgOk(false)} />
              )}

              {/* Bubble */}
              {msg.type === 'audio' ? (
                <AudioPlayer src={msg.src} autoPlay={isFirstEver && i === 1 && messages.length <= 2} />
              ) : (
                <div style={{
                  maxWidth: '78%',
                  backgroundColor: msg.role === 'user' ? '#4B5E4B' : '#1A1D1A',
                  border: msg.role === 'user' ? 'none' : '1px solid #2A302A',
                  borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  padding: '10px 13px',
                }}>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: msg.role === 'user' ? '#fff' : '#8DA38D', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <MayaAvatar size={28} imgOk={imgOk} onError={() => setImgOk(false)} />
              <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '12px 12px 12px 0' }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick prompts ── */}
        {messages.filter(m => m.role === 'user').length === 0 && (
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
            {quickPrompts.map((p, i) => (
              <button key={i} onClick={() => setInput(p)}
                style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '16px', padding: '6px 12px', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5E4B'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A302A'}
              >{p}</button>
            ))}
          </div>
        )}

        {/* ── Input ── */}
        <div style={{ backgroundColor: '#151715', borderTop: '1px solid #2A302A', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0 }}>
          <textarea
            value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta, soldado..." rows={1} disabled={loading}
            style={{ flex: 1, backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '8px', padding: '10px 12px', color: '#e5e7eb', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', outline: 'none', resize: 'none', lineHeight: 1.4, maxHeight: '100px', overflowY: 'auto' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
            onFocus={e => e.target.style.borderColor = '#4B5E4B'}
            onBlur={e => e.target.style.borderColor = '#2A302A'}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: '8px', backgroundColor: loading || !input.trim() ? '#2A302A' : '#4B5E4B', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '18px', transition: 'background-color 0.2s', flexShrink: 0 }}
          >
            {loading ? <div style={{ width: 16, height: 16, border: '2px solid #8DA38D', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : '➤'}
          </button>
        </div>

        <style>{`
          @keyframes bounce    { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }
          @keyframes spin      { to{transform:rotate(360deg)} }
          @keyframes fadeInMsg { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        `}</style>
      </div>
    </>
  )
}
