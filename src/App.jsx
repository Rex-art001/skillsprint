
import { useEffect, useState } from 'react'
import './App.css'

const starterTasks = [
  { id: 1, title: 'Review engineering notes', category: 'Study', time: '09:00 AM', done: true },
  { id: 2, title: 'Complete project research', category: 'Project', time: '11:30 AM', done: false },
  { id: 3, title: 'Practice JavaScript', category: 'Coding', time: '02:00 PM', done: false },
  { id: 4, title: 'Read for 20 minutes', category: 'Personal', time: '05:00 PM', done: false },
]

const navItems = [
  { icon: '◫', label: 'Overview' },
  { icon: '✓', label: 'My Tasks' },
  { icon: '◷', label: 'Focus Room' },
  { icon: '▥', label: 'Analytics' },
]

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('skillsprint-tasks')
      return saved ? JSON.parse(saved) : starterTasks
    } catch {
      return starterTasks
    }
  })

  const [active, setActive] = useState('Overview')
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('Study')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    localStorage.setItem('skillsprint-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setSeconds(current => {
        if (current <= 1) {
          window.clearInterval(timer)
          setRunning(false)
          setSessionComplete(true)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  const completed = tasks.filter(task => task.done).length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const focusProgress = ((25 * 60 - seconds) / (25 * 60)) * 100

  const formatTime = value => {
    const mins = Math.floor(value / 60).toString().padStart(2, '0')
    const secs = (value % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  function addTask(event) {
    event.preventDefault()
    if (!newTask.trim()) return

    setTasks(previous => [
      ...previous,
      {
        id: Date.now(),
        title: newTask.trim(),
        category,
        time: 'Anytime',
        done: false,
      },
    ])
    setNewTask('')
  }

  function toggleTask(id) {
    setTasks(previous =>
      previous.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  function resetTimer() {
    setRunning(false)
    setSeconds(25 * 60)
    setSessionComplete(false)
  }

  function deleteTask(id) {
    setTasks(previous => previous.filter(task => task.id !== id))
  }

  const heading = {
    Overview: ['Make today count.', "You don't need to be perfect. Just keep moving forward."],
    'My Tasks': ['One task at a time.', 'Your goals become achievable when you break them down.'],
    'Focus Room': ['Find your focus.', 'Give one thing your full attention.'],
    Analytics: ['Look how far you can go.', 'Every small action adds up over time.'],
  }[active]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setActive('Overview')}>
          <span className="brand-icon">S</span>
          <span className="brand-word">
            skill<span>sprint</span>
            <small>YOUR GROWTH SPACE</small>
          </span>
        </button>

        <p className="nav-caption">WORKSPACE</p>

        <nav className="navigation">
          {navItems.map(item => (
            <button
              key={item.label}
              className={`nav-item ${active === item.label ? 'selected' : ''}`}
              onClick={() => setActive(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'My Tasks' && (
                <span className="nav-count">{tasks.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="sparkle">✳</span>
            <strong>Small steps. Big growth.</strong>
            <p>Consistency turns goals into results. Keep showing up for yourself.</p>
          </div>

          <div className="profile">
            <div className="avatar">N</div>
            <div className="profile-copy">
              <strong>My Workspace</strong>
              <small>Personal dashboard</small>
            </div>
            <span className="profile-dots">✦</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active}</strong>
          </div>
          <div className="topbar-right">
            <span className="live-dot" />
            Your personal growth space
            <div className="avatar small-avatar">N</div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR DAY. YOUR PACE. YOUR PROGRESS.</p>
            <h1>{heading[0]}</h1>
            <p className="welcome-text">{heading[1]}</p>
          </div>
          <div className="date-pill">✦ &nbsp; A NEW DAY TO GROW</div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span>Tasks completed</span>
              <span className="stat-icon purple">✓</span>
            </div>
            <div className="stat-number">
              {completed}<span> / {tasks.length}</span>
            </div>
            <div className="stat-foot">Keep building momentum</div>
            <div className="mini-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Daily progress</span>
              <span className="stat-icon blue">↗</span>
            </div>
            <div className="stat-number">{progress}<span>%</span></div>
            <div className="stat-foot">Your completed task percentage</div>
            <div className="mini-progress blue-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span>Focus countdown</span>
              <span className="stat-icon orange">◷</span>
            </div>
            <div className="stat-number timer-stat">{formatTime(seconds)}</div>
            <div className="stat-foot">
              {running ? 'Session in progress' : 'Your next 25-minute session'}
            </div>
            <button className="text-action" onClick={() => setActive('Focus Room')}>
              Open focus room ↗
            </button>
          </article>
        </section>

        {active === 'Overview' && (
          <section className="overview-banner">
            <div className="banner-symbol">✦</div>
            <div>
              <strong>Make time for what matters.</strong>
              <p>Choose your priorities, protect your focus, and celebrate progress.</p>
            </div>
            <button onClick={() => setActive('My Tasks')}>View my tasks ↗</button>
          </section>
        )}

        {active === 'Analytics' && (
          <section className="analytics-grid">
            <article className="panel analytics-card">
              <p className="eyebrow">TASK BREAKDOWN</p>
              <h2>Your progress at a glance</h2>
              <div className="analytics-ring" style={{
                background: `conic-gradient(#a494ff ${progress}%, #2a2939 0)`
              }}>
                <div><strong>{progress}%</strong><span>COMPLETED</span></div>
              </div>
              <p className="analytics-note">
                {completed} completed out of {tasks.length} total tasks.
              </p>
            </article>
            <article className="panel analytics-card">
              <p className="eyebrow">YOUR WORKLOAD</p>
              <h2>Tasks by category</h2>
              {['Study', 'Project', 'Coding', 'Personal'].map(name => {
                const count = tasks.filter(task => task.category === name).length
                const amount = tasks.length ? count / tasks.length * 100 : 0
                return (
                  <div className="category-stat" key={name}>
                    <div><span>{name}</span><strong>{count}</strong></div>
                    <div className="mini-progress">
                      <span style={{ width: `${amount}%` }} />
                    </div>
                  </div>
                )
              })}
            </article>
          </section>
        )}

        <section className="content-grid">
          <article className="panel tasks-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">
                  {active === 'My Tasks' ? 'YOUR TASK MANAGER' : 'YOUR PLAN'}
                </p>
                <h2>
                  {active === 'My Tasks' ? 'All your tasks' : "Today's tasks"}
                  <span className="heading-count">{tasks.length}</span>
                </h2>
              </div>
              <span className="subtle-label">{completed} of {tasks.length} done</span>
            </div>

            <form className="add-task" onSubmit={addTask}>
              <input
                value={newTask}
                onChange={event => setNewTask(event.target.value)}
                placeholder="What do you want to accomplish?"
                aria-label="New task"
              />
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
                aria-label="Task category"
              >
                <option>Study</option>
                <option>Project</option>
                <option>Coding</option>
                <option>Personal</option>
              </select>
              <button type="submit">+ Add</button>
            </form>

            <div className="task-list">
              {tasks.map(task => (
                <div className={`task-row ${task.done ? 'task-done' : ''}`} key={task.id}>
                  <label className="task-check-label">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark ${task.title} ${task.done ? 'incomplete' : 'complete'}`}
                    />
                    <span className="custom-check">{task.done ? '✓' : ''}</span>
                  </label>

                  <span className="task-details">
                    <strong>{task.title}</strong>
                    <small>{task.time}</small>
                  </span>

                  <span className={`category category-${task.category.toLowerCase()}`}>
                    {task.category}
                  </span>

                  <button
                    className="delete-task"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="empty-state">
                  <span>✦</span>
                  <strong>A fresh start!</strong>
                  <p>Add your first task and make today count.</p>
                </div>
              )}
            </div>

            <div className="task-footer">
              <span>✦ &nbsp; Progress over perfection.</span>
              <span>{progress}% complete</span>
            </div>
          </article>

          <div className="right-column">
            <article className="focus-card">
              <div className="focus-heading">
                <span className="focus-symbol">◷</span>
                <span>FOCUS ROOM</span>
                <span className="focus-live">● {running ? 'FOCUSING' : 'READY'}</span>
              </div>

              <h2>{sessionComplete ? 'Session complete!' : 'Protect your focus.'}</h2>
              <p>
                {sessionComplete
                  ? 'Excellent work. Take a short break before your next session.'
                  : 'One task. One session. No distractions.'}
              </p>

              <div
                className="timer-ring"
                style={{
                  background: `conic-gradient(#a494ff ${focusProgress}%, #373047 ${focusProgress}% 100%)`
                }}
              >
                <div>
                  <strong>{formatTime(seconds)}</strong>
                  <span>TIME REMAINING</span>
                </div>
              </div>

              <div className="timer-controls">
                <button
                  className="timer-start"
                  onClick={() => {
                    if (seconds === 0) resetTimer()
                    else setRunning(value => !value)
                  }}
                >
                  {running ? 'Ⅱ Pause session' : seconds === 0 ? '↻ Start again' : '▶ Start focus'}
                </button>
                <button className="timer-reset" onClick={resetTimer} title="Reset timer">
                  ↺
                </button>
              </div>
              <p className="focus-tip">✦ &nbsp; One focused minute is a win.</p>
            </article>

            <article className="quote-card">
              <span className="quote-mark">“</span>
              <p>The secret of getting ahead is getting started.</p>
              <span className="quote-author">A REMINDER FOR YOU</span>
            </article>
          </div>
        </section>

        <footer className="page-footer">
          <span>SKILLSPRINT © 2026</span>
          <span>Built for progress, not perfection. ✦</span>
        </footer>
      </main>
    </div>
  )
}

export default App
