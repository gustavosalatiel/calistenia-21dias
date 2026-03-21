import { useState, useEffect, useRef } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL = 'gemini-2.5-flash-lite'

// URL da imagem da Maya — substitua pela foto real se tiver
const MAYA_IMAGE_URL = 'https://res.cloudinary.com/dv7lkj9bq/image/upload/v1/maya-instructora.jpg'

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

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '8px 12px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4B5E4B', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

// Avatar da Maya — imagem real com fallback gracioso
function MayaAvatar({ size = 40, showOnline = true }) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', flexShrink: 0 }}>
      {imgOk ? (
        <img
          src={MAYA_IMAGE_URL}
          alt="Maya"
          onError={() => setImgOk(false)}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: `2px solid #4B5E4B` }}
        />
      ) : (
        // Fallback CSS avatar quando imagem não carrega
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a3a2a 0%, #0d2a1a 50%, #1a3a2a 100%)',
          border: '2px solid #4B5E4B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.42,
        }}>
          💪
        </div>
      )}
      {showOnline && (
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.25, height: size * 0.25,
          backgroundColor: '#4ade80', borderRadius: '50%',
          border: `${Math.max(1, size * 0.05)}px solid #151715`,
          boxShadow: '0 0 5px #4ade80',
        }} />
      )}
    </div>
  )
}

// ─── TTS (Text-to-Speech) via Web Speech API ────────────────────────────────
let currentUtterance = null

function speakText(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 300))
  utterance.lang = 'es-MX'
  utterance.rate = 1.05
  utterance.pitch = 1.1
  utterance.volume = 1

  // Prefer Spanish female voice
  const voices = window.speechSynthesis.getVoices()
  const esVoice = voices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('mujer'))
    || voices.find(v => v.lang.startsWith('es'))
  if (esVoice) utterance.voice = esVoice

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}

function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

// ────────────────────────────────────────────────────────────────────────────

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 480)
  useEffect(() => {
    const h = () => setWidth(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return width
}

export default function MayaChat({ onClose, userEmail }) {
  const STORAGE_KEY = `maya_chat_${userEmail || 'guest'}`
  const windowWidth = useWindowWidth()
  const isDesktop = windowWidth >= 768

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false) // áudio desligado por padrão
  const [speaking, setSpeaking] = useState(false)
  const messagesEndRef = useRef(null)

  // Welcome message on first open
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = {
        role: 'assistant',
        content: '¡Hola soldado! 👋 Soy Maya, tu instructora táctica personal. Estoy aquí para ayudarte con tus entrenamientos, nutrición, recuperación y cualquier duda del programa. ¿En qué te puedo apoyar hoy? 💪',
        timestamp: Date.now(),
      }
      setMessages([welcome])
    }
    // Pre-load voices
    if (window.speechSynthesis) window.speechSynthesis.getVoices()
  }, [])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Save to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)))
    }
  }, [messages])

  // Stop speech on unmount
  useEffect(() => () => stopSpeech(), [])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage = { role: 'user', content: text, timestamp: Date.now() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const contents = []
      const historyMessages = newMessages.slice(-20)
      for (const msg of historyMessages) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: MAYA_SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.9, maxOutputTokens: 800 },
          }),
        }
      )

      const data = await response.json()
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (replyText) {
        const assistantMessage = { role: 'assistant', content: replyText, timestamp: Date.now() }
        setMessages(prev => [...prev, assistantMessage])
        // TTS auto-play if enabled
        if (audioEnabled) {
          setSpeaking(true)
          speakText(replyText)
          if (window.speechSynthesis) {
            const utt = new SpeechSynthesisUtterance('')
            utt.onend = () => setSpeaking(false)
          }
          setTimeout(() => setSpeaking(false), 8000)
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento soldado, tuve un problema de conexión. ¿Puedes repetir tu pregunta? 🔄', timestamp: Date.now() }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hay un problema de conexión ahora mismo. Intenta en un momento, recluta 💪', timestamp: Date.now() }])
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    stopSpeech()
    setMessages([{ role: 'assistant', content: '¡Historial limpio, soldado! 🧹 ¿En qué te puedo ayudar hoy? 💪', timestamp: Date.now() }])
  }

  const toggleAudio = () => {
    if (audioEnabled) {
      stopSpeech()
      setSpeaking(false)
    }
    setAudioEnabled(prev => !prev)
  }

  const handleSpeakMessage = (text) => {
    if (speaking) { stopSpeech(); setSpeaking(false); return }
    setSpeaking(true)
    speakText(text)
    setTimeout(() => setSpeaking(false), 10000)
  }

  const quickPrompts = [
    '¿Cómo mejorar mis pull-ups?',
    '¿Qué comer antes de entrenar?',
    '¿Cómo recuperarme más rápido?',
    'Tips para el Día 1',
  ]

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    backgroundColor: '#0F110F',
    display: 'flex',
    flexDirection: 'column',
    ...(isDesktop ? {
      maxWidth: '680px',
      maxHeight: '82vh',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      inset: 'unset',
      borderRadius: '12px',
      border: '1px solid #2A302A',
      boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
    } : {
      maxWidth: '480px',
      margin: '0 auto',
    }),
  }

  return (
    <>
      {/* Overlay for desktop */}
      {isDesktop && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 49 }} onClick={onClose} />
      )}

      <div style={containerStyle}>
        {/* Header */}
        <div style={{ backgroundColor: '#151715', borderBottom: '1px solid #2A302A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderRadius: isDesktop ? '12px 12px 0 0' : '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MayaAvatar size={44} showOnline={true} />
            <div>
              <div style={{ fontFamily: '"Black Ops One", cursive', fontSize: '17px', color: '#ffffff' }}>MAYA</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B', letterSpacing: '2px' }}>
                INSTRUCTORA TÁCTICA · EN LÍNEA
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {/* Audio toggle */}
            <button
              onClick={toggleAudio}
              title={audioEnabled ? 'Desactivar voz de Maya' : 'Activar voz de Maya'}
              style={{
                backgroundColor: audioEnabled ? 'rgba(75,94,75,0.25)' : '#1A1D1A',
                border: `1px solid ${audioEnabled ? '#4B5E4B' : '#2A302A'}`,
                borderRadius: '6px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              {audioEnabled ? (speaking ? '🔊' : '🔔') : '🔕'}
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: audioEnabled ? '#4ade80' : '#4B5E4B' }}>
                {audioEnabled ? 'VOZ ON' : 'VOZ OFF'}
              </span>
            </button>

            {/* Clear history */}
            <button
              onClick={handleClearHistory}
              style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}
              title="Limpiar historial"
            >🗑️</button>

            {/* Close */}
            <button
              onClick={onClose}
              style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8DA38D', fontSize: '16px' }}
            >✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end', animation: 'fadeInMsg 0.3s ease-out' }}>
              {msg.role === 'assistant' && <MayaAvatar size={28} showOnline={false} />}
              <div style={{ maxWidth: '78%', position: 'relative' }}>
                <div style={{
                  backgroundColor: msg.role === 'user' ? '#4B5E4B' : '#1A1D1A',
                  border: msg.role === 'user' ? 'none' : '1px solid #2A302A',
                  borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                  padding: '10px 12px',
                }}>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', color: msg.role === 'user' ? '#ffffff' : '#8DA38D', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {msg.content}
                  </p>
                </div>
                {/* Speak button on Maya messages */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleSpeakMessage(msg.content)}
                    title="Ouvir Maya"
                    style={{ position: 'absolute', bottom: -2, right: -24, width: 20, height: 20, backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', opacity: 0.5, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                  >
                    🔊
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <MayaAvatar size={28} showOnline={false} />
              <div style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '12px 12px 12px 0' }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
            {quickPrompts.map((prompt, i) => (
              <button key={i} onClick={() => setInput(prompt)} style={{ backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '16px', padding: '6px 12px', cursor: 'pointer', fontFamily: '"Share Tech Mono", monospace', fontSize: '10px', color: '#8DA38D', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4B5E4B'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2A302A'}
              >{prompt}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ backgroundColor: '#151715', borderTop: '1px solid #2A302A', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0, borderRadius: isDesktop ? '0 0 12px 12px' : '0' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta, soldado..."
            rows={1}
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#1A1D1A', border: '1px solid #2A302A', borderRadius: '8px', padding: '10px 12px', color: '#e5e7eb', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px', outline: 'none', resize: 'none', lineHeight: 1.4, maxHeight: '100px', overflowY: 'auto' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
            onFocus={e => e.target.style.borderColor = '#4B5E4B'}
            onBlur={e => e.target.style.borderColor = '#2A302A'}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: '8px', backgroundColor: loading || !input.trim() ? '#2A302A' : '#4B5E4B', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', fontSize: '18px', transition: 'background-color 0.2s', flexShrink: 0 }}
          >
            {loading ? (
              <div style={{ width: 16, height: 16, border: '2px solid #8DA38D', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : '➤'}
          </button>
        </div>

        <style>{`
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          @keyframes spin   { to { transform: rotate(360deg); } }
          @keyframes fadeInMsg { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </>
  )
}
