import { NavLink, Link } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Intro' },
  { to: '/globe', label: 'Globe' },
  { to: '/orbit', label: 'Orbit' },
]

function SiteNav() {
  return (
    <header className="site-nav">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div>
          <p className="brand-title">SARASWATI</p>
          <p className="brand-sub">AI Root Learning System</p>
        </div>
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-actions">
        <Link className="nav-button ghost" to="/globe">
          View demo
        </Link>
        <button className="nav-button primary">Start free</button>
      </div>
    </header>
  )
}

export default SiteNav
