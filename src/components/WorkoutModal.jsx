import { useState } from 'react'

const typeColors = {
  FUERZA: { bg: 'rgba(75,94,75,0.2)', text: '#8DA38D', border: '#4B5E4B' },
  HIIT: { bg: 'rgba(220,38,38,0.15)', text: '#f87171', border: '#dc2626' },
  MIXTO: { bg: 'rgba(234,179,8,0.15)', text: '#fbbf24', border: '#d97706' },
}

function isVideoUrl(url) {
  return url && url.includes('.mp4')
}

function isImageUrl(url) {
  return url && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp'))
}

function ExerciseCard({ exercise, index }) {
  const [descExpanded, setDescExpanded] = useState(false)
  const [done, setDone] = useState(false)

  return (
    <div style={{
      backgroundColor: done ? 'rgba(75,94,75,0.1)' : '#0F110F',
      border: done ? '1px solid rgba(75,94,75,0.4)' : '1px solid #2A302A',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Media */}
      {exercise.videoUrl && isVideoUrl(exercise.videoUrl) && (
        <video
          src={exercise.videoUrl}
          controls
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            display: 'block',
            maxHeight: '200px',
            objectFit: 'cover',
            backgroundColor: '#0F110F',
          }}
        />
      )}
      {exercise.videoUrl && isImageUrl(exercise.videoUrl) && (
        <img
          src={exercise.videoUrl}
          alt={exercise.name}
          style={{
            width: '100%',
            display: 'block',
            maxHeight: '180px',
            objectFit: 'cover',
          }}
        />
      )}
      {!exercise.videoUrl && (
        <div style={{
          backgroundColor: '#1A1D1A',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #2A302A',
        }}>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#2A302A',
            letterSpacing: '2px',
          }}>
            SIN VIDEO DISPONIBLE
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '1px',
              marginBottom: '2px',
            }}>
              {exercise.obj}
            </div>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '14px',
              color: done ? '#8DA38D' : '#ffffff',
            }}>
              {exercise.name}
            </div>
          </div>
          <button
            onClick={() => setDone(!done)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: done ? '#4B5E4B' : 'transparent',
              border: done ? 'none' : '1px solid #2A302A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              color: done ? '#fff' : '#4B5E4B',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            title={done ? 'Marcar como pendiente' : 'Marcar como listo'}
          >
            {done ? '✓' : '○'}
          </button>
        </div>

        {/* Description */}
        <div>
          <p style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '11px',
            color: '#8DA38D',
            lineHeight: 1.5,
            marginBottom: '8px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: descExpanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {exercise.description}
          </p>
          {exercise.description.length > 80 && (
            <button
              onClick={() => setDescExpanded(!descExpanded)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#4B5E4B',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '10px',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '8px',
              }}
            >
              {descExpanded ? '▲ VER MENOS' : '▼ VER MÁS'}
            </button>
          )}
        </div>

        {/* Series/Reps/Rest */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderRadius: '4px',
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#8DA38D' }}>
              {exercise.series}
            </span>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
              SERIES
            </span>
          </div>
          <div style={{
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderRadius: '4px',
            padding: '4px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}>
            <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '13px', color: '#8DA38D', textAlign: 'center' }}>
              {exercise.reps}
            </span>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
              REPS
            </span>
          </div>
          <div style={{
            backgroundColor: '#1A1D1A',
            border: '1px solid #2A302A',
            borderRadius: '4px',
            padding: '4px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '14px', color: '#8DA38D' }}>
              {exercise.rest}s
            </span>
            <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
              DESCANSO
            </span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {exercise.tags.map((tag, i) => (
            <span key={i} style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              backgroundColor: 'rgba(75,94,75,0.1)',
              border: '1px solid rgba(75,94,75,0.3)',
              borderRadius: '3px',
              padding: '2px 6px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WorkoutModal({ workout, isCompleted, onClose, onComplete }) {
  const colors = typeColors[workout.type] || typeColors.MIXTO

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
      }}>
        {/* BG Image overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${workout.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.08,
        }} />
        <div style={{ position: 'relative', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
              letterSpacing: '2px',
            }}>
              {workout.operationCode}
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
                fontFamily: '"Share Tech Mono", monospace',
              }}
            >
              ✕
            </button>
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '20px',
            color: '#ffffff',
            marginBottom: '4px',
          }}>
            DÍA {workout.day}: {workout.protocolName}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              padding: '2px 8px',
              borderRadius: '3px',
            }}>
              {workout.type}
            </span>
            <span>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ opacity: i <= workout.difficulty ? 1 : 0.2, fontSize: '11px' }}>🔥</span>
              ))}
            </span>
            {isCompleted && (
              <span style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                backgroundColor: 'rgba(75,94,75,0.2)',
                color: '#8DA38D',
                border: '1px solid #4B5E4B',
                padding: '2px 8px',
                borderRadius: '3px',
              }}>
                ✓ COMPLETADO
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>

        {/* Mission info */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '9px',
            color: '#4B5E4B',
            letterSpacing: '2px',
            marginBottom: '6px',
          }}>
            INFORME DE MISIÓN
          </div>
          <p style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '12px',
            color: '#8DA38D',
            lineHeight: 1.5,
            marginBottom: '12px',
          }}>
            {workout.missionReport}
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0F110F',
              borderRadius: '6px',
              padding: '8px 14px',
              border: '1px solid #2A302A',
            }}>
              <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#8DA38D' }}>
                {workout.duration}
              </span>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
                MINUTOS
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0F110F',
              borderRadius: '6px',
              padding: '8px 14px',
              border: '1px solid #2A302A',
            }}>
              <span style={{ fontFamily: '"Black Ops One", cursive', fontSize: '18px', color: '#8DA38D' }}>
                {workout.exercises.length}
              </span>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
                EJERCICIOS
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#0F110F',
              borderRadius: '6px',
              padding: '8px 14px',
              border: '1px solid #2A302A',
              flex: 1,
            }}>
              <span style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '14px',
                color: colors.text,
              }}>
                {workout.type}
              </span>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '8px', color: '#4B5E4B' }}>
                TIPO
              </span>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#4B5E4B',
          letterSpacing: '3px',
          marginBottom: '10px',
        }}>
          OBJETIVOS TÁCTICOS — {workout.exercises.length} EJERCICIOS
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} index={index} />
          ))}
        </div>

        {/* Complete / Revoke Button */}
        <button
          onClick={() => {
            onComplete(workout.day)
            onClose()
          }}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: isCompleted ? 'rgba(220,38,38,0.1)' : '#4B5E4B',
            border: isCompleted ? '1px solid rgba(220,38,38,0.3)' : 'none',
            borderRadius: '6px',
            color: isCompleted ? '#f87171' : '#ffffff',
            fontFamily: '"Black Ops One", cursive',
            fontSize: '16px',
            letterSpacing: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginBottom: '16px',
          }}
        >
          {isCompleted ? '↩ REVOCAR MISIÓN' : '✓ MISIÓN COMPLETADA'}
        </button>

        {/* Back button */}
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
            letterSpacing: '2px',
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
