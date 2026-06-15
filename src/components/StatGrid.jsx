import { motion } from 'framer-motion'
import { fmtNum, yearFrom } from '../lib/utils'

function StatCell({ label, value, sub, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'var(--nt-black)',
        padding: '16px 18px',
      }}
    >
      <div style={{ fontSize: 8, letterSpacing: '0.22em', color: 'var(--nt-grey4)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--ff-mono)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 24, letterSpacing: '0.02em', lineHeight: 1, color: 'var(--nt-white)' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: 'var(--nt-grey3)', marginTop: 4, letterSpacing: '0.08em', fontFamily: 'var(--ff-mono)' }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

export default function StatGrid({ user, repos }) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0)

  const cells = [
    { label: 'Repositories', value: fmtNum(user.public_repos), sub: 'PUBLIC' },
    { label: 'Followers',    value: fmtNum(user.followers),    sub: 'NETWORK' },
    { label: 'Following',    value: fmtNum(user.following),    sub: 'TRACKING' },
    { label: 'Total Stars',  value: fmtNum(totalStars),        sub: 'ACROSS ALL REPOS' },
    { label: 'Total Forks',  value: fmtNum(totalForks),        sub: 'FORKED BY OTHERS' },
    { label: 'Gists',        value: fmtNum(user.public_gists), sub: 'PUBLIC SNIPPETS' },
    { label: 'Member Since', value: yearFrom(user.created_at), sub: 'YEAR JOINED' },
    { label: 'Avg Stars',    value: fmtNum(Math.round(totalStars / Math.max(repos.length, 1))), sub: 'PER REPO' },
    { label: 'Avg Forks',   value: fmtNum(Math.round(totalForks / Math.max(repos.length, 1))), sub: 'PER REPO' },
  ]

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text="// profile.metrics" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'var(--nt-grey2)',
        border: '1px solid var(--nt-grey2)',
      }}>
        {cells.map((c, i) => (
          <StatCell key={c.label} {...c} delay={i * 0.04} />
        ))}
      </div>
    </div>
  )
}

export function SectionLabel({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    }}>
      <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--nt-grey4)', textTransform: 'uppercase', fontFamily: 'var(--ff-mono)', whiteSpace: 'nowrap' }}>
        {text}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--nt-grey2)' }} />
    </div>
  )
}
