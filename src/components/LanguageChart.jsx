import { motion } from 'framer-motion'
import { getLangColor } from '../lib/utils'
import { SectionLabel } from './StatGrid'

export default function LanguageChart({ repos }) {
  const langCount = {}
  repos.forEach(r => {
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
  })
  const total = Object.values(langCount).reduce((a, b) => a + b, 0)
  if (!total) return null

  const sorted = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang, cnt]) => ({ lang, cnt, pct: +((cnt / total) * 100).toFixed(1) }))

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text="// languages.distribution" />

      {/* Bar */}
      <div style={{ height: 5, display: 'flex', marginBottom: 16, overflow: 'hidden', gap: 1 }}>
        {sorted.map(({ lang, pct }, i) => (
          <motion.div
            key={lang}
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: pct, background: getLangColor(lang), height: '100%' }}
          />
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--nt-grey2)', border: '1px solid var(--nt-grey2)' }}>
        {sorted.map(({ lang, pct }, i) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: 'var(--nt-black)',
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: getLangColor(lang), flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, flex: 1, color: 'var(--nt-white)', letterSpacing: '0.03em' }}>
              {lang}
            </span>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--nt-grey4)' }}>
              {pct}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
