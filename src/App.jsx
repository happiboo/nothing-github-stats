import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGitHub } from './hooks/useGitHub'
import SearchBar from './components/SearchBar'
import ProfileHeader from './components/ProfileHeader'
import StatGrid from './components/StatGrid'
import LanguageChart from './components/LanguageChart'
import ContribHeatmap from './components/ContribHeatmap'
import SnakeGame from './components/SnakeGame'
import RepoGrid from './components/RepoGrid'
import ReadmeGenerator from './components/ReadmeGenerator'
import Tabs from './components/Tabs'
import GlyphBar from './components/GlyphBar'
import './styles/global.css'

const FADE = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -6 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
}

export default function App() {
  const { user, repos, loading, error, fetchUser } = useGitHub()
  const [tab, setTab] = useState('overview')

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0 80px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, letterSpacing: '0.35em', color: 'var(--nt-grey3)', textTransform: 'uppercase', marginBottom: 4 }}>
              // nothing
            </div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 18, letterSpacing: '0.08em', color: 'var(--nt-white)' }}>
              GITHUB STATS
            </div>
          </div>
          <GlyphBar count={16} interval={180} />
        </motion.div>

        {/* Search */}
        <SearchBar onSearch={fetchUser} loading={loading} error={error} />

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: 'center',
                padding: '48px 0',
                fontFamily: 'var(--ff-mono)',
                fontSize: 10,
                letterSpacing: '0.25em',
                color: 'var(--nt-grey3)',
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                // FETCHING DATA ···
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <AnimatePresence mode="wait">
          {user && !loading && (
            <motion.div key={user.login} {...FADE}>
              <ProfileHeader user={user} />
              <Tabs active={tab} onChange={setTab} />

              <AnimatePresence mode="wait">
                {tab === 'overview' && (
                  <motion.div key="overview" {...FADE}>
                    <StatGrid user={user} repos={repos} />
                    <ContribHeatmap username={user.login} />
                    <LanguageChart repos={repos} />
                  </motion.div>
                )}

                {tab === 'repos' && (
                  <motion.div key="repos" {...FADE}>
                    <RepoGrid repos={repos} />
                  </motion.div>
                )}

                {tab === 'snake' && (
                  <motion.div key="snake" {...FADE}>
                    <SnakeGame username={user.login} />
                  </motion.div>
                )}

                {tab === 'readme' && (
                  <motion.div key="readme" {...FADE}>
                    <ReadmeGenerator user={user} repos={repos} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!user && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              textAlign: 'center',
              padding: '64px 0',
              fontFamily: 'var(--ff-mono)',
              color: 'var(--nt-grey3)',
              letterSpacing: '0.1em',
              fontSize: 11,
            }}
          >
            <div style={{ marginBottom: 8 }}>// enter a github username above</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>try: torvalds · sindresorhus · gaearon</div>
          </motion.div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 48,
          paddingTop: 20,
          borderTop: '1px solid var(--nt-grey2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--nt-grey3)', letterSpacing: '0.1em', fontFamily: 'var(--ff-mono)' }}>
            NOTHING DESIGN LANGUAGE · {new Date().getFullYear()}
          </div>
          <div style={{ fontSize: 9, color: 'var(--nt-grey3)', letterSpacing: '0.08em', fontFamily: 'var(--ff-mono)' }}>
            GITHUB API · PUBLIC DATA ONLY
          </div>
        </div>

      </div>
    </div>
  )
}
