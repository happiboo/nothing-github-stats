import { motion } from 'framer-motion'
import { fmtDate } from '../lib/utils'

export default function ProfileHeader({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        paddingBottom: 28,
        marginBottom: 28,
        borderBottom: '1px solid var(--nt-grey2)',
      }}
    >
      {/* Avatar with corner brackets */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <motion.img
          src={user.avatar_url}
          alt={user.login}
          initial={{ filter: 'grayscale(1) contrast(1.2) brightness(0.7)' }}
          animate={{ filter: 'grayscale(1) contrast(1.1) brightness(0.85)' }}
          transition={{ duration: 1 }}
          style={{
            width: 80,
            height: 80,
            display: 'block',
            border: '1px solid var(--nt-grey3)',
          }}
        />
        {[
          { top: -4, left: -4, borderTop: '2px solid var(--nt-white)', borderLeft: '2px solid var(--nt-white)' },
          { top: -4, right: -4, borderTop: '2px solid var(--nt-white)', borderRight: '2px solid var(--nt-white)' },
          { bottom: -4, left: -4, borderBottom: '2px solid var(--nt-white)', borderLeft: '2px solid var(--nt-white)' },
          { bottom: -4, right: -4, borderBottom: '2px solid var(--nt-white)', borderRight: '2px solid var(--nt-white)' },
        ].map((style, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            style={{ position: 'absolute', width: 10, height: 10, ...style }}
          />
        ))}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--nt-grey4)', marginBottom: 4, fontFamily: 'var(--ff-mono)', textTransform: 'uppercase' }}>
          // profile.identity
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ fontFamily: 'var(--ff-mono)', fontSize: 22, letterSpacing: '0.05em', lineHeight: 1.1, marginBottom: 4 }}
        >
          {user.name || user.login}
        </motion.div>
        <div style={{ fontSize: 11, color: 'var(--nt-grey4)', letterSpacing: '0.08em', marginBottom: 8 }}>
          @{user.login}
        </div>
        {user.bio && (
          <div style={{ fontSize: 11, color: 'var(--nt-grey5)', lineHeight: 1.6, letterSpacing: '0.02em', maxWidth: 360, marginBottom: 8 }}>
            {user.bio}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {user.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, background: 'var(--nt-white)', borderRadius: '50%' }} />
              <span style={{ fontSize: 10, color: 'var(--nt-grey4)', letterSpacing: '0.1em', fontFamily: 'var(--ff-mono)' }}>
                {user.location.toUpperCase()}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              style={{ width: 5, height: 5, background: 'var(--nt-white)', borderRadius: '50%' }}
            />
            <span style={{ fontSize: 10, color: 'var(--nt-grey4)', letterSpacing: '0.1em', fontFamily: 'var(--ff-mono)' }}>
              JOINED {fmtDate(user.created_at).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
