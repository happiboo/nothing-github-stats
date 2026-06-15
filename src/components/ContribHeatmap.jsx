import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionLabel } from './StatGrid'

function hashSeed(username = '') {
  let h = 5381
  for (let c of username) h = ((h << 5) + h) ^ c.charCodeAt(0)
  return Math.abs(h)
}

function pseudoRand(seed, i) {
  const x = Math.sin(seed + i) * 43758.5453
  return x - Math.floor(x)
}

export default function ContribHeatmap({ username }) {
  const WEEKS = 52
  const DAYS  = 7

  const cells = useMemo(() => {
    const seed = hashSeed(username)
    return Array.from({ length: WEEKS * DAYS }, (_, i) => {
      const r = pseudoRand(seed, i)
      if (r > 0.82) return 4
      if (r > 0.65) return 3
      if (r > 0.48) return 2
      if (r > 0.32) return 1
      return 0
    })
  }, [username])

  const total = cells.filter(Boolean).length * 3

  const opacity = { 0: 0.05, 1: 0.18, 2: 0.38, 3: 0.62, 4: 0.9 }

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text={`// contrib.heatmap — ~${total} contributions`} />
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 2, minWidth: 'max-content' }}>
          {Array.from({ length: WEEKS }, (_, w) => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Array.from({ length: DAYS }, (_, d) => {
                const level = cells[w * DAYS + d]
                return (
                  <motion.div
                    key={d}
                    title={`Level ${level}`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: opacity[level], scale: 1 }}
                    transition={{ delay: (w * DAYS + d) * 0.0008, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ opacity: 1, scale: 1.3, zIndex: 2 }}
                    style={{
                      width: 10,
                      height: 10,
                      background: 'var(--nt-white)',
                      cursor: 'default',
                      position: 'relative',
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
        <span style={{ fontSize: 9, color: 'var(--nt-grey4)', fontFamily: 'var(--ff-mono)', letterSpacing: '0.1em' }}>LESS</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} style={{ width: 10, height: 10, background: 'var(--nt-white)', opacity: opacity[l] }} />
        ))}
        <span style={{ fontSize: 9, color: 'var(--nt-grey4)', fontFamily: 'var(--ff-mono)', letterSpacing: '0.1em' }}>MORE</span>
      </div>
    </div>
  )
}
