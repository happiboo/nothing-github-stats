import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PATTERNS = [
  [1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0],
  [0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0],
  [0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0],
  [0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1],
  [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
]

export default function GlyphBar({ count = 20, interval = 160 }) {
  const indexRef = useRef(0)
  const segRefs  = useRef([])

  useEffect(() => {
    const id = setInterval(() => {
      const p = PATTERNS[indexRef.current % PATTERNS.length]
      segRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.opacity   = p[i] ? '0.85' : '0.1'
        el.style.transform = p[i] ? 'scaleY(1)' : 'scaleY(0.6)'
      })
      indexRef.current++
    }, interval)
    return () => clearInterval(id)
  }, [interval])

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          ref={el => segRefs.current[i] = el}
          style={{
            width: 3,
            height: 14,
            background: 'var(--nt-white)',
            opacity: 0.1,
            transformOrigin: 'bottom',
            transition: `opacity ${interval * 0.8}ms ease, transform ${interval * 0.8}ms ease`,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}
