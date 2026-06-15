import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionLabel } from './StatGrid'

const COLS = 26
const ROWS = 7
const CELL = 14
const GAP  = 2
const SPEED_NORMAL = 130
const SPEED_FAST   = 60

function hashSeed(username = '') {
  let h = 5381
  for (let c of username) h = ((h << 5) + h) ^ c.charCodeAt(0)
  return Math.abs(h)
}
function pRand(seed, i) {
  const x = Math.sin(seed + i) * 43758.5453
  return x - Math.floor(x)
}
function makeGrid(username) {
  const seed = hashSeed(username)
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      const v = pRand(seed, r * COLS + c)
      if (v > 0.82) return 4
      if (v > 0.65) return 3
      if (v > 0.48) return 2
      if (v > 0.32) return 1
      return 0
    })
  )
}

const DIR = { ArrowUp: [0,-1], ArrowDown: [0,1], ArrowLeft: [-1,0], ArrowRight: [1,0], w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] }
const CELL_OPACITY = { 0: 0.05, 1: 0.15, 2: 0.33, 3: 0.58, 4: 0.85 }

export default function SnakeGame({ username }) {
  const initialGrid = useMemo(() => makeGrid(username), [username])
  const [grid, setGrid]     = useState(initialGrid)
  const [snake, setSnake]   = useState([[3, 3],[2, 3],[1, 3]])
  const [dir, setDir]       = useState([1, 0])
  const [food, setFood]     = useState([10, 3])
  const [score, setScore]   = useState(0)
  const [eaten, setEaten]   = useState([])
  const [alive, setAlive]   = useState(false)
  const [dead, setDead]     = useState(false)
  const [paused, setPaused] = useState(false)
  const [fast, setFast]     = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [autoPlay, setAutoPlay]   = useState(false)

  const dirRef   = useRef(dir)
  const snakeRef = useRef(snake)
  const gridRef  = useRef(grid)
  const foodRef  = useRef(food)
  const aliveRef = useRef(false)
  const pausedRef = useRef(false)
  const autoRef  = useRef(false)

  useEffect(() => { dirRef.current = dir }, [dir])
  useEffect(() => { snakeRef.current = snake }, [snake])
  useEffect(() => { gridRef.current = grid }, [grid])
  useEffect(() => { foodRef.current = food }, [food])
  useEffect(() => { aliveRef.current = alive }, [alive])
  useEffect(() => { pausedRef.current = paused }, [paused])
  useEffect(() => { autoRef.current = autoPlay }, [autoPlay])

  const placeFood = useCallback((s, g) => {
    const available = []
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        if ((g[y][x] ?? 0) > 0 && !s.some(([sx, sy]) => sx === x && sy === y))
          available.push([x, y])
      }
    if (!available.length) return null
    return available[Math.floor(Math.random() * available.length)]
  }, [])

  const resetGame = useCallback(() => {
    const fresh = makeGrid(username)
    const initSnake = [[3,3],[2,3],[1,3]]
    const initFood = placeFood(initSnake, fresh) ?? [10,3]
    setGrid(fresh)
    setSnake(initSnake)
    setDir([1,0])
    setFood(initFood)
    setScore(0)
    setEaten([])
    setDead(false)
    setPaused(false)
  }, [username, placeFood])

  const autoDir = useCallback(() => {
    const s = snakeRef.current
    const g = gridRef.current
    const f = foodRef.current
    const head = s[0]
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
    // BFS-lite: just pick dir toward food avoiding walls + self
    const valid = dirs.filter(([dx,dy]) => {
      const nx = head[0]+dx, ny = head[1]+dy
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false
      if (s.some(([sx,sy]) => sx===nx && sy===ny)) return false
      return true
    })
    if (!valid.length) return dirRef.current
    // prefer dirs that move toward food
    const scored = valid.map(([dx,dy]) => {
      const nx = head[0]+dx, ny = head[1]+dy
      const dist = Math.abs(nx - f[0]) + Math.abs(ny - f[1])
      return { d:[dx,dy], dist }
    })
    scored.sort((a,b) => a.dist - b.dist)
    return scored[0].d
  }, [])

  // Game loop
  useEffect(() => {
    let raf
    let last = 0
    const step = (ts) => {
      raf = requestAnimationFrame(step)
      if (!aliveRef.current || pausedRef.current) return
      const speed = fast ? SPEED_FAST : SPEED_NORMAL
      if (ts - last < speed) return
      last = ts

      if (autoRef.current) {
        dirRef.current = autoDir()
        setDir(dirRef.current)
      }

      const [dx, dy] = dirRef.current
      const head = snakeRef.current[0]
      const nx = head[0] + dx
      const ny = head[1] + dy

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS ||
          snakeRef.current.some(([sx,sy]) => sx===nx && sy===ny)) {
        setAlive(false)
        aliveRef.current = false
        setDead(true)
        setHighScore(h => Math.max(h, snakeRef.current.length - 3))
        return
      }

      const ateFood = nx === foodRef.current[0] && ny === foodRef.current[1]
      let newSnake = [[nx,ny], ...snakeRef.current]
      if (!ateFood) newSnake.pop()

      if (ateFood) {
        const newGrid = gridRef.current.map(row => [...row])
        newGrid[ny][nx] = 0
        gridRef.current = newGrid
        setGrid(newGrid)
        setScore(sc => sc + (gridRef.current[ny]?.[nx] ?? 1))
        setEaten(e => [...e, `${nx},${ny}`])

        const nf = placeFood(newSnake, newGrid)
        if (nf) { setFood(nf); foodRef.current = nf }
        else    { setFood(null); foodRef.current = null }
      }

      snakeRef.current = newSnake
      setSnake([...newSnake])
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [fast, placeFood, autoDir])

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault()
      if (e.key === ' ') { setPaused(p => !p); return }
      const d = DIR[e.key]
      if (!d) return
      const cur = dirRef.current
      if (d[0] === -cur[0] && d[1] === -cur[1]) return // no 180
      setDir(d)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const startGame = () => { resetGame(); setAlive(true); aliveRef.current = true }

  const snakeSet = new Set(snake.map(([x,y]) => `${x},${y}`))
  const headKey  = snake[0] ? `${snake[0][0]},${snake[0][1]}` : ''

  const W = COLS * (CELL + GAP) - GAP
  const H = ROWS * (CELL + GAP) - GAP

  return (
    <div style={{ marginBottom: 28 }}>
      <SectionLabel text="// snake.eating.contributions" />

      {/* Controls bar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12, flexWrap:'wrap' }}>
        <span style={{ fontSize:9, letterSpacing:'0.2em', color:'var(--nt-grey4)', fontFamily:'var(--ff-mono)' }}>
          SCORE: {score} &nbsp;|&nbsp; HIGH: {highScore}
        </span>
        <div style={{ flex:1 }} />
        {!alive && !dead && (
          <CtrlBtn onClick={startGame}>▶ START</CtrlBtn>
        )}
        {alive && (
          <>
            <CtrlBtn onClick={() => setPaused(p => !p)}>{paused ? '▶ RESUME' : '⏸ PAUSE'}</CtrlBtn>
            <CtrlBtn onClick={() => setFast(f => !f)} active={fast}>⚡ FAST</CtrlBtn>
            <CtrlBtn onClick={() => setAutoPlay(a => !a)} active={autoPlay}>🤖 AUTO</CtrlBtn>
          </>
        )}
        {dead && (
          <CtrlBtn onClick={startGame}>↺ RESTART</CtrlBtn>
        )}
      </div>

      {/* Grid canvas */}
      <div style={{ position:'relative', width:W, maxWidth:'100%', overflow:'hidden', border:'1px solid var(--nt-grey2)' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          style={{ display:'block', background:'var(--nt-black)' }}
        >
          {/* Contribution cells */}
          {grid.map((row, y) =>
            row.map((level, x) => {
              const key = `${x},${y}`
              const isSnake = snakeSet.has(key)
              const isHead  = key === headKey
              const isFood  = food && food[0]===x && food[1]===y
              const cx = x * (CELL + GAP)
              const cy = y * (CELL + GAP)
              return (
                <g key={key}>
                  {/* Background cell */}
                  <rect
                    x={cx} y={cy} width={CELL} height={CELL}
                    fill={`rgba(232,232,224,${CELL_OPACITY[level] ?? 0.05})`}
                  />
                  {/* Snake body */}
                  {isSnake && !isHead && (
                    <rect x={cx+1} y={cy+1} width={CELL-2} height={CELL-2} fill="rgba(232,232,224,0.75)" />
                  )}
                  {/* Snake head */}
                  {isHead && (
                    <>
                      <rect x={cx} y={cy} width={CELL} height={CELL} fill="var(--nt-white)" />
                      <rect x={cx+3} y={cy+3} width={3} height={3} fill="var(--nt-black)" />
                      <rect x={cx+8} y={cy+3} width={3} height={3} fill="var(--nt-black)" />
                    </>
                  )}
                  {/* Food indicator */}
                  {isFood && (
                    <rect
                      x={cx+3} y={cy+3} width={CELL-6} height={CELL-6}
                      fill="none"
                      stroke="var(--nt-white)"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              )
            })
          )}

          {/* Scanline overlay */}
          {Array.from({ length: ROWS }).map((_, i) => (
            <line key={i} x1={0} y1={i*(CELL+GAP)-1} x2={W} y2={i*(CELL+GAP)-1}
              stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          ))}
        </svg>

        {/* Overlay messages */}
        <AnimatePresence>
          {!alive && !dead && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                background:'rgba(10,10,10,0.75)',
                fontFamily:'var(--ff-mono)',
                gap:8,
              }}
            >
              <div style={{ fontSize:11, letterSpacing:'0.2em', color:'var(--nt-grey4)' }}>// snake.ready</div>
              <div style={{ fontSize:9, color:'var(--nt-grey4)', letterSpacing:'0.15em' }}>ARROW KEYS / WASD TO MOVE · SPACE TO PAUSE</div>
            </motion.div>
          )}
          {dead && (
            <motion.div
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                background:'rgba(10,10,10,0.8)',
                fontFamily:'var(--ff-mono)',
                gap:6,
              }}
            >
              <div style={{ fontSize:13, letterSpacing:'0.15em', color:'var(--nt-white)' }}>// GAME OVER</div>
              <div style={{ fontSize:10, color:'var(--nt-grey4)', letterSpacing:'0.12em' }}>SCORE: {score} &nbsp;|&nbsp; HIGH: {highScore}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* D-pad for mobile */}
      <div style={{ marginTop:12, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
        <DPadBtn onClick={() => { const d=[0,-1]; if(dirRef.current[1]!==1) setDir(d) }}>▲</DPadBtn>
        <div style={{ display:'flex', gap:4 }}>
          <DPadBtn onClick={() => { const d=[-1,0]; if(dirRef.current[0]!==1) setDir(d) }}>◀</DPadBtn>
          <DPadBtn onClick={() => { const d=[0,1]; if(dirRef.current[1]!==-1) setDir(d) }}>▼</DPadBtn>
          <DPadBtn onClick={() => { const d=[1,0]; if(dirRef.current[0]!==-1) setDir(d) }}>▶</DPadBtn>
        </div>
      </div>
    </div>
  )
}

function CtrlBtn({ onClick, children, active }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ background:'rgba(232,232,224,0.12)' }}
      whileTap={{ scale:0.96 }}
      style={{
        background: active ? 'rgba(232,232,224,0.15)' : 'transparent',
        border: `1px solid ${active ? 'rgba(232,232,224,0.4)' : 'var(--nt-grey3)'}`,
        color: active ? 'var(--nt-white)' : 'var(--nt-grey5)',
        fontFamily:'var(--ff-mono)',
        fontSize:9,
        letterSpacing:'0.15em',
        padding:'6px 12px',
        cursor:'pointer',
        textTransform:'uppercase',
      }}
    >
      {children}
    </motion.button>
  )
}

function DPadBtn({ onClick, children }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale:0.9, background:'rgba(232,232,224,0.15)' }}
      style={{
        background:'transparent',
        border:'1px solid var(--nt-grey2)',
        color:'var(--nt-grey4)',
        fontFamily:'var(--ff-mono)',
        fontSize:12,
        width:36,
        height:36,
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        userSelect:'none',
      }}
    >
      {children}
    </motion.button>
  )
}
