import { useState, useCallback } from 'react'

export function useGitHub() {
  const [user, setUser]     = useState(null)
  const [repos, setRepos]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const fetch_ = useCallback(async (username) => {
    if (!username.trim()) return
    setLoading(true)
    setError(null)
    setUser(null)
    setRepos([])

    try {
      const [uRes, rRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`),
      ])

      if (!uRes.ok) {
        setError(uRes.status === 404 ? 'USER_NOT_FOUND' : 'RATE_LIMIT')
        return
      }

      const u = await uRes.json()
      const r = rRes.ok ? await rRes.json() : []
      setUser(u)
      setRepos(Array.isArray(r) ? r : [])
    } catch {
      setError('NETWORK_ERROR')
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, repos, loading, error, fetchUser: fetch_ }
}
