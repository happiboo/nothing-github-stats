import { motion } from 'framer-motion'
import { getLangColor } from '../lib/utils'
import { SectionLabel } from './StatGrid'

function RepoCard({ repo, index }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ background: 'rgba(232,232,224,0.04)' }}
      style={{
        display: 'block',
        background: 'var(--nt-black)',
        padding: '16px',
        textDecoration: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'var(--nt-white)', transformOrigin: 'left',
        }}
        transition={{ duration: 0.25 }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--nt-white)', letterSpacing: '0.04em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {repo.name}
        </div>
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          whileHover={{ opacity: 1, x: 0 }}
          style={{ fontSize: 11, color: 'var(--nt-grey4)', flexShrink: 0, paddingLeft: 6 }}
        >
          ↗
        </motion.span>
      </div>

      <div style={{ fontSize: 10, color: 'var(--nt-grey4)', lineHeight: 1.5, marginBottom: 12, letterSpacing: '0.02em', minHeight: 30 }}>
        {repo.description ? repo.description.substring(0, 72) + (repo.description.length > 72 ? '…' : '') : 'no description'}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--nt-grey4)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ★ {repo.stargazers_count}
        </span>
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--nt-grey4)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ⑂ {repo.forks_count}
        </span>
        {repo.language && (
          <>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: getLangColor(repo.language), flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'var(--nt-grey4)', fontFamily: 'var(--ff-mono)' }}>{repo.language}</span>
          </>
        )}
      </div>
    </motion.a>
  )
}

export default function RepoGrid({ repos }) {
  const top = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text="// repositories.top" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1px',
        background: 'var(--nt-grey2)',
        border: '1px solid var(--nt-grey2)',
      }}>
        {top.map((repo, i) => (
          <RepoCard key={repo.id} repo={repo} index={i} />
        ))}
      </div>
    </div>
  )
}
