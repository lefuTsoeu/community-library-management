import { useState } from "react";

export default function Login({ users, onLogin }) {
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!membershipId.trim()) {
      setError("Please enter your membership ID.");
      return;
    }
    if (!onLogin(membershipId)) {
      setError("Membership ID not found. Try ADMIN001 or MEM001.");
      return;
    }
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">📚</div>
        <p className="eyebrow">COMMUNITY LIBRARY</p>
        <h1>Library Management System</h1>
        <p className="muted">Sign in to manage books, stock, transactions and members.</p>

        <form onSubmit={submit} className="form-stack">
          <label>Membership ID
            <input
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              placeholder="e.g. ADMIN001"
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="primary-btn" type="submit">Sign in</button>
        </form>

        <div className="demo-box">
          <strong>Demo accounts</strong>
          <span>Admin: ADMIN001</span>
          <span>Member: MEM001</span>
        </div>
      </div>
    </div>
  );
}