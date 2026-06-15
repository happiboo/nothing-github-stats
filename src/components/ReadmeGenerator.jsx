import { useState } from 'react'
import { motion } from 'framer-motion'
import { buildReadme } from '../lib/utils'
import { SectionLabel } from './StatGrid'

export default function ReadmeGenerator({ user, repos }) {
  const [copied, setCopied] = useState(false)
  const code = buildReadme(user, repos)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionLabel text="// readme.generator" />
        <motion.button
          onClick={copy}
          whileHover={{ background: 'rgba(232,232,224,0.1)', borderColor: 'var(--nt-grey5)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: 'transparent',
            border: '1px solid var(--nt-grey3)',
            color: copied ? 'var(--nt-white)' : 'var(--nt-grey4)',
            fontFamily: 'var(--ff-mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            padding: '6px 14px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            flexShrink: 0,
            marginLeft: 12,
            marginBottom: 12,
          }}
        >
          {copied ? '✓ COPIED' : 'COPY CODE ↗'}
        </motion.button>
      </div>
      <div style={{ fontSize: 9, color: 'var(--nt-grey4)', fontFamily: 'var(--ff-mono)', marginBottom: 10, lineHeight: 1.5 }}>
        // paste into your <strong style={{ color: 'var(--nt-grey5)' }}>username/username</strong> repository README.md
      </div>
      <pre style={{
        background: 'rgba(232,232,224,0.03)',
        border: '1px solid var(--nt-grey2)',
        padding: '16px',
        fontFamily: 'var(--ff-mono)',
        fontSize: 10,
        color: 'var(--nt-grey5)',
        lineHeight: 1.7,
        letterSpacing: '0.02em',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        overflowY: 'auto',
        maxHeight: 360,
      }}>
        {code}
      </pre>
    </div>
  )
}
