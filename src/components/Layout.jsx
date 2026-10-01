import { NavLink } from "react-router-dom";

export default function Layout({ children, currentUser, onLogout }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <h1>Community Library</h1>
            <span>Management System</span>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/books">Book Management</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/users">User Management</NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.role}</small>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">LIBRARY PORTAL</p>
            <h2>Welcome back, {currentUser.name.split(" ")[0]}</h2>
          </div>
          <div className="status-pill"><span></span> Local Storage Active</div>
        </header>
        {children}
      </main>
    </div>
  );
}