import { useState, useEffect, useRef } from 'react'

const GEMINI_API_KEY = 'AIzaSyBaWw_7o8VvUp66PKvQOxtRso5bFBpjzY8'
const GEMINI_MODEL = 'gemini-2.5-flash-lite'

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
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      padding: '8px 12px',
    }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#4B5E4B',
            animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function MayaChat({ onClose, userEmail }) {
  const STORAGE_KEY = `maya_chat_${userEmail || 'guest'}`

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage = { role: 'user', content: text, timestamp: Date.now() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // Build conversation history for Gemini
      const contents = []

      // Add history (last 20 messages for context)
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
            system_instruction: {
              parts: [{ text: MAYA_SYSTEM_PROMPT }],
            },
            contents,
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 800,
            },
          }),
        }
      )

      const data = await response.json()
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (replyText) {
        const assistantMessage = {
          role: 'assistant',
          content: replyText,
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Lo siento soldado, tuve un problema de conexión. ¿Puedes repetir tu pregunta? 🔄',
          timestamp: Date.now(),
        }])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hay un problema de conexión ahora mismo. Intenta en un momento, recluta 💪',
        timestamp: Date.now(),
      }])
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
    const welcome = {
      role: 'assistant',
      content: '¡Historial limpio, soldado! 🧹 ¿En qué te puedo ayudar hoy? 💪',
      timestamp: Date.now(),
    }
    setMessages([welcome])
  }

  const quickPrompts = [
    '¿Cómo mejorar mis pull-ups?',
    '¿Qué comer antes de entrenar?',
    '¿Cómo recuperarme más rápido?',
    'Tips para el Día 1',
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      backgroundColor: '#0F110F',
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#151715',
        borderBottom: '1px solid #2A302A',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#1A1D1A',
            border: '2px solid #4B5E4B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            position: 'relative',
          }}>
            🤖
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 10,
              height: 10,
              backgroundColor: '#4ade80',
              borderRadius: '50%',
              border: '2px solid #151715',
            }} />
          </div>
          <div>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '16px',
              color: '#ffffff',
            }}>
              MAYA
            </div>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '2px',
            }}>
              INSTRUCTORA TÁCTICA · EN LÍNEA
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleClearHistory}
            style={{
              backgroundColor: '#1A1D1A',
              border: '1px solid #2A302A',
              borderRadius: '4px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
            }}
            title="Limpiar historial"
          >
            🗑️
          </button>
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
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-end',
              animation: 'fadeInMsg 0.3s ease-out',
            }}
          >
            {msg.role === 'assistant' && (
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#1A1D1A',
                border: '1px solid #4B5E4B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                flexShrink: 0,
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              backgroundColor: msg.role === 'user' ? '#4B5E4B' : '#1A1D1A',
              border: msg.role === 'user' ? 'none' : '1px solid #2A302A',
              borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
              padding: '10px 12px',
            }}>
              <p style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '12px',
                color: msg.role === 'user' ? '#ffffff' : '#8DA38D',
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#1A1D1A',
              border: '1px solid #4B5E4B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              flexShrink: 0,
            }}>
              🤖
            </div>
            <div style={{
              backgroundColor: '#1A1D1A',
              border: '1px solid #2A302A',
              borderRadius: '12px 12px 12px 0',
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div style={{
          padding: '0 16px 8px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt)
              }}
              style={{
                backgroundColor: '#1A1D1A',
                border: '1px solid #2A302A',
                borderRadius: '16px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '10px',
                color: '#8DA38D',
                transition: 'border-color 0.2s',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{
        backgroundColor: '#151715',
        borderTop: '1px solid #2A302A',
        padding: '12px 16px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta, soldado..."
          rows={1}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderRadius: '8px',
            padding: '10px 12px',
            color: '#e5e7eb',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '12px',
            outline: 'none',
            resize: 'none',
            lineHeight: 1.4,
            maxHeight: '100px',
            overflowY: 'auto',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4B5E4B'}
          onBlur={(e) => e.target.style.borderColor = '#2A302A'}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 42,
            height: 42,
            borderRadius: '8px',
            backgroundColor: loading || !input.trim() ? '#2A302A' : '#4B5E4B',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            transition: 'background-color 0.2s',
            flexShrink: 0,
          }}
        >
          {loading ? (
            <div style={{
              width: 16,
              height: 16,
              border: '2px solid #8DA38D',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          ) : '➤'}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
