import { useState } from 'react'
import { motion } from 'framer-motion'

const S = {
  wrap: {
    marginBottom: 32,
  },
  label: {
    fontSize: 9,
    letterSpacing: '0.25em',
    color: 'var(--nt-grey4)',
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: 'var(--ff-mono)',
    display: 'block',
  },
  row: {
    display: 'flex',
    border: '1px solid var(--nt-grey3)',
    transition: 'border-color 0.2s',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--nt-white)',
    fontFamily: 'var(--ff-mono)',
    fontSize: 13,
    padding: '12px 16px',
    outline: 'none',
    letterSpacing: '0.05em',
  },
  btn: {
    background: 'transparent',
    border: 'none',
    borderLeft: '1px solid var(--nt-grey3)',
    color: 'var(--nt-white)',
    fontFamily: 'var(--ff-mono)',
    fontSize: 9,
    letterSpacing: '0.2em',
    padding: '12px 20px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    transition: 'background 0.15s',
    whiteSpace: 'nowrap',
  },
  error: {
    marginTop: 8,
    fontSize: 10,
    color: 'rgba(255,90,90,0.7)',
    letterSpacing: '0.08em',
    fontFamily: 'var(--ff-mono)',
  },
}

const ERROR_MSG = {
  USER_NOT_FOUND: '// error: user not found',
  RATE_LIMIT:     '// error: api rate limit — wait 60s',
  NETWORK_ERROR:  '// error: network failure',
}

export default function SearchBar({ onSearch, loading, error }) {
  const [value, setValue] = useState('')
  const [hover, setHover]  = useState(false)

  const submit = () => { if (value.trim()) onSearch(value.trim()) }

  return (
    <div style={S.wrap}>
      <span style={S.label}>// github.handle</span>
      <div style={{ ...S.row, borderColor: hover ? 'var(--nt-grey5)' : 'var(--nt-grey3)' }}>
        <input
          style={S.input}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="enter username"
          autoComplete="off"
          spellCheck="false"
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
        />
        <motion.button
          style={S.btn}
          onClick={submit}
          whileHover={{ background: 'rgba(232,232,224,0.1)' }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? '···' : 'LOAD ↗'}
        </motion.button>
      </div>
      {error && (
        <motion.div
          style={S.error}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {ERROR_MSG[error] ?? '// error: unknown'}
        </motion.div>
      )}
    </div>
  )
}
