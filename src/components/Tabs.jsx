import { motion } from 'framer-motion'

const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'repos',    label: 'REPOS' },
  { id: 'snake',    label: 'SNAKE' },
  { id: 'readme',   label: 'README' },
]

export default function Tabs({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--nt-grey2)',
      marginBottom: 24,
      gap: 0,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${active === tab.id ? 'var(--nt-white)' : 'transparent'}`,
            color: active === tab.id ? 'var(--nt-white)' : 'var(--nt-grey4)',
            fontFamily: 'var(--ff-mono)',
            fontSize: 9,
            letterSpacing: '0.22em',
            padding: '10px 16px',
            cursor: 'pointer',
            marginBottom: -1,
            transition: 'color 0.15s, border-color 0.15s',
            textTransform: 'uppercase',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
