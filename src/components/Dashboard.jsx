import { useState } from 'react'

const typeColors = {
  FUERZA: { bg: 'rgba(75,94,75,0.2)', text: '#8DA38D', border: '#4B5E4B' },
  HIIT: { bg: 'rgba(220,38,38,0.15)', text: '#f87171', border: '#dc2626' },
  MIXTO: { bg: 'rgba(234,179,8,0.15)', text: '#fbbf24', border: '#d97706' },
}

function DifficultyFlames({ level }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ opacity: i <= level ? 1 : 0.2, fontSize: '12px' }}>🔥</span>
      ))}
    </span>
  )
}

function DayCell({ workout, isCompleted, isNext, isLocked, onSelect }) {
  const colors = typeColors[workout.type] || typeColors.MIXTO
  return (
    <button
      onClick={() => !isLocked && onSelect(workout)}
      title={isLocked ? `Completa el Día ${workout.day - 1} para desbloquear` : workout.protocolName}
      style={{
        backgroundColor: isLocked
          ? '#111311'
          : isCompleted ? 'rgba(75,94,75,0.3)'
          : isNext ? 'rgba(75,94,75,0.15)'
          : '#1A1D1A',
        border: isLocked
          ? '1px solid #1A1D1A'
          : isNext ? '1px solid #4B5E4B'
          : isCompleted ? '1px solid rgba(75,94,75,0.5)'
          : '1px solid #2A302A',
        borderRadius: '6px',
        padding: '8px 6px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        position: 'relative',
        minHeight: '64px',
        justifyContent: 'center',
        opacity: isLocked ? 0.45 : 1,
      }}
    >
      {isCompleted && !isLocked && (
        <div style={{
          position: 'absolute',
          top: 3,
          right: 3,
          width: 14,
          height: 14,
          backgroundColor: '#4B5E4B',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          color: '#fff',
        }}>✓</div>
      )}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: 3,
          right: 3,
          fontSize: '9px',
        }}>🔒</div>
      )}
      <div style={{
        fontFamily: '"Black Ops One", cursive',
        fontSize: '11px',
        color: isLocked ? '#3a3a3a' : isCompleted ? '#8DA38D' : isNext ? '#fff' : '#8DA38D',
      }}>
        D{workout.day}
      </div>
      {isLocked ? (
        <div style={{
          fontSize: '9px',
          fontFamily: '"Share Tech Mono", monospace',
          color: '#2A302A',
          letterSpacing: '0.5px',
        }}>
          —
        </div>
      ) : (
        <div style={{
          fontSize: '9px',
          fontFamily: '"Share Tech Mono", monospace',
          color: colors.text,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: '2px',
          padding: '1px 4px',
          letterSpacing: '0.5px',
        }}>
          {workout.type}
        </div>
      )}
      {!isLocked && (
        <div style={{ fontSize: '8px' }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} style={{ opacity: i <= workout.difficulty ? 1 : 0.2, fontSize: '8px' }}>🔥</span>
          ))}
        </div>
      )}
    </button>
  )
}

export default function Dashboard({
  workouts,
  completedDays,
  userEmail,
  profile,
  nextDay,
  onSelectDay,
  onOpenNutrition,
  onOpenSleep,
  onOpenBonus,
  onOpenMaya,
  onOpenProfile,
  onStartDay,
}) {
  const progress = Math.round((completedDays.length / 21) * 100)
  const displayName = profile?.name || userEmail?.split('@')[0]?.toUpperCase() || 'OPERATIVO'

  const featureCards = [
    {
      id: 'nutrition',
      icon: '🥗',
      title: 'NUTRICIÓN',
      subtitle: 'PLAN TÁCTICO',
      desc: 'Plan nutricional personalizado por IA',
      color: '#4B5E4B',
      onClick: onOpenNutrition,
    },
    {
      id: 'sleep',
      icon: '🌙',
      title: 'PROTOCOLO',
      subtitle: 'DE SUEÑO',
      desc: 'Optimiza tu recuperación nocturna',
      color: '#4a4b6b',
      onClick: onOpenSleep,
    },
    {
      id: 'bonus',
      icon: '📋',
      title: 'BONUS',
      subtitle: 'MATERIALES',
      desc: 'PDFs exclusivos del programa',
      color: '#6b4a2a',
      onClick: onOpenBonus,
    },
    {
      id: 'maya',
      icon: '🤖',
      title: 'MAYA IA',
      subtitle: 'INSTRUCTORA',
      desc: 'Tu asistente táctica personal',
      color: '#2a4b6b',
      onClick: onOpenMaya,
    },
  ]

  return (
    <div style={{
      backgroundColor: '#0F110F',
      minHeight: '100vh',
      paddingBottom: '80px',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
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
            letterSpacing: '3px',
          }}>
            SISTEMA OPERATIVO
          </div>
          <div style={{
            fontFamily: '"Black Ops One", cursive',
            fontSize: '16px',
            color: '#8DA38D',
          }}>
            DESAFÍO 21 DÍAS
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '9px',
              color: '#4B5E4B',
            }}>
              PROGRESO
            </div>
            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '18px',
              color: '#8DA38D',
            }}>
              {progress}%
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#1A1D1A',
              border: '1px solid #2A302A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            👤
          </button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Hero Progress Panel */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #2A302A',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, rgba(75,94,75,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4B5E4B',
                letterSpacing: '2px',
                marginBottom: '2px',
              }}>
                BIENVENIDO, OPERATIVO
              </div>
              <div style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '20px',
                color: '#ffffff',
              }}>
                {displayName}
              </div>
            </div>
            <div style={{
              textAlign: 'right',
            }}>
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4B5E4B',
              }}>DÍAS COMPLETADOS</div>
              <div style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '28px',
                color: '#8DA38D',
                lineHeight: 1,
              }}>
                {completedDays.length}<span style={{ fontSize: '14px', color: '#4B5E4B' }}>/21</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#4B5E4B' }}>
                PROGRESO DE MISIÓN
              </span>
              <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '9px', color: '#8DA38D' }}>
                {progress}%
              </span>
            </div>
            <div style={{
              height: '6px',
              backgroundColor: '#0F110F',
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: '#4B5E4B',
                borderRadius: '3px',
                transition: 'width 0.5s ease',
                boxShadow: '0 0 8px rgba(75,94,75,0.6)',
              }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}>
            {[
              { label: 'COMPLETADOS', value: completedDays.length },
              { label: 'RESTANTES', value: 21 - completedDays.length },
              { label: 'PRÓXIMO DÍA', value: `D${nextDay.day}` },
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: '#0F110F',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                border: '1px solid #2A302A',
              }}>
                <div style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '16px',
                  color: '#8DA38D',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '8px',
                  color: '#4B5E4B',
                  letterSpacing: '0.5px',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Mission / Next Day Card */}
        <div style={{
          backgroundColor: '#1A1D1A',
          border: '1px solid #4B5E4B',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '16px',
          cursor: 'pointer',
          position: 'relative',
        }}
          onClick={() => onSelectDay(nextDay)}
        >
          {/* Background image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${nextDay.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }} />

          <div style={{ position: 'relative', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '9px',
                  color: '#4B5E4B',
                  letterSpacing: '2px',
                  marginBottom: '2px',
                }}>
                  MISIÓN ACTIVA
                </div>
                <div style={{
                  fontFamily: '"Black Ops One", cursive',
                  fontSize: '11px',
                  color: '#8DA38D',
                }}>
                  {nextDay.operationCode}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
              }}>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '9px',
                  backgroundColor: typeColors[nextDay.type]?.bg || 'rgba(75,94,75,0.2)',
                  color: typeColors[nextDay.type]?.text || '#8DA38D',
                  border: `1px solid ${typeColors[nextDay.type]?.border || '#4B5E4B'}`,
                  padding: '2px 8px',
                  borderRadius: '3px',
                }}>
                  {nextDay.type}
                </div>
                <DifficultyFlames level={nextDay.difficulty} />
              </div>
            </div>

            <div style={{
              fontFamily: '"Black Ops One", cursive',
              fontSize: '18px',
              color: '#ffffff',
              marginBottom: '8px',
            }}>
              DÍA {nextDay.day}: {nextDay.protocolName}
            </div>

            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '11px',
              color: '#8DA38D',
              marginBottom: '14px',
              lineHeight: 1.5,
            }}>
              {nextDay.missionReport}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '10px',
                  color: '#4B5E4B',
                }}>
                  ⏱ {nextDay.duration} MIN
                </div>
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: '10px',
                  color: '#4B5E4B',
                }}>
                  💪 {nextDay.exercises.length} EJERCICIOS
                </div>
              </div>
              <div style={{
                backgroundColor: '#4B5E4B',
                color: '#fff',
                fontFamily: '"Black Ops One", cursive',
                fontSize: '11px',
                padding: '8px 16px',
                borderRadius: '4px',
                letterSpacing: '1px',
              }}>
                INICIAR ▶
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '10px',
          color: '#4B5E4B',
          letterSpacing: '3px',
          marginBottom: '10px',
        }}>
          MÓDULOS DEL PROGRAMA
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px',
        }}>
          {featureCards.map((card) => (
            <button
              key={card.id}
              onClick={card.onClick}
              style={{
                backgroundColor: '#1A1D1A',
                border: '1px solid #2A302A',
                borderRadius: '8px',
                padding: '16px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4B5E4B'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2A302A'}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: 0,
                right: 0,
                height: '2px',
                backgroundColor: card.color,
                opacity: 0.6,
              }} />
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '12px',
                color: '#ffffff',
                lineHeight: 1.2,
              }}>
                {card.title}
              </div>
              <div style={{
                fontFamily: '"Black Ops One", cursive',
                fontSize: '12px',
                color: '#8DA38D',
                lineHeight: 1.2,
                marginBottom: '6px',
              }}>
                {card.subtitle}
              </div>
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: '#4B5E4B',
                lineHeight: 1.4,
              }}>
                {card.desc}
              </div>
            </button>
          ))}
        </div>

        {/* 21-Day Timeline Grid */}
        <div style={{
          marginBottom: '16px',
        }}>
          <div style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '10px',
            color: '#4B5E4B',
            letterSpacing: '3px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>CALENDARIO TÁCTICO</span>
            <span style={{ color: '#8DA38D' }}>{completedDays.length}/21 DÍAS</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '6px',
          }}>
            {workouts.map((workout) => {
              const isCompleted = completedDays.includes(workout.day)
              const isNext = workout.day === nextDay.day && !isCompleted
              // Dia 1 sempre desbloqueado; demais exigem o anterior completo
              const isLocked = workout.day > 1 && !completedDays.includes(workout.day - 1)
              return (
                <DayCell
                  key={workout.day}
                  workout={workout}
                  isCompleted={isCompleted}
                  isNext={isNext}
                  isLocked={isLocked}
                  onSelect={onSelectDay}
                />
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '8px',
        }}>
          {Object.entries(typeColors).map(([type, colors]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: 8,
                height: 8,
                backgroundColor: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: '2px',
              }} />
              <span style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '9px',
                color: colors.text,
              }}>
                {type}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#151715',
        borderTop: '1px solid #2A302A',
        display: 'flex',
        alignItems: 'center',
        zIndex: 40,
        padding: '0 4px',
      }}>
        {/* Profile */}
        <button
          onClick={onOpenProfile}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '18px' }}>👤</span>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '8px',
            color: '#4B5E4B',
            letterSpacing: '0.5px',
          }}>PERFIL</span>
        </button>

        {/* Nutrition */}
        <button
          onClick={onOpenNutrition}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🥗</span>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '8px',
            color: '#4B5E4B',
            letterSpacing: '0.5px',
          }}>NUTRICIÓN</span>
        </button>

        {/* Center START DAY button */}
        <button
          onClick={onStartDay}
          style={{
            flex: 'none',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#4B5E4B',
            border: '3px solid #8DA38D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            margin: '0 6px',
            boxShadow: '0 0 20px rgba(75,94,75,0.5)',
            gap: '1px',
            position: 'relative',
            top: '-10px',
          }}
        >
          <span style={{ fontSize: '20px' }}>▶</span>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '7px',
            color: '#fff',
            letterSpacing: '0.5px',
          }}>INICIAR</span>
        </button>

        {/* Sleep */}
        <button
          onClick={onOpenSleep}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🌙</span>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '8px',
            color: '#4B5E4B',
            letterSpacing: '0.5px',
          }}>SUEÑO</span>
        </button>

        {/* Maya */}
        <button
          onClick={onOpenMaya}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            gap: '3px',
          }}
        >
          <span style={{ fontSize: '18px' }}>🤖</span>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '8px',
            color: '#4B5E4B',
            letterSpacing: '0.5px',
          }}>MAYA</span>
        </button>
      </div>

      {/* Maya floating chat button (alternative) */}
      <button
        onClick={onOpenMaya}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#2a4b6b',
          border: '1px solid #3a6b9b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          fontSize: '20px',
          zIndex: 30,
          maxWidth: '480px',
          marginRight: 'auto',
        }}
        title="Hablar con Maya"
      >
        💬
      </button>
    </div>
  )
}
