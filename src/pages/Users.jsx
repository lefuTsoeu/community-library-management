import { useState } from "react";
import Modal from "../components/Modal";

const blank = { name: "", membershipId: "", role: "Member" };

export default function Users({ users, currentUser, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.membershipId.trim()) {
      setError("Name and membership ID are required.");
      return;
    }
    if (users.some((u) => u.membershipId.toLowerCase() === form.membershipId.trim().toLowerCase())) {
      setError("Membership ID must be unique.");
      return;
    }
    onAdd(form);
    setForm(blank);
    setError("");
  };

  const save = (e) => {
    e.preventDefault();
    if (!editing.name.trim() || !editing.membershipId.trim()) {
      setError("Name and membership ID are required.");
      return;
    }
    onUpdate(editing);
    setEditing(null);
    setError("");
  };

  return (
    <>
      <section className="page-heading">
        <div><p className="eyebrow">MEMBERS</p><h1>User Management</h1><p className="muted">Manage library accounts and membership information.</p></div>
      </section>

      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>Add New User</h3><p>Create a library account with a role.</p></div></div>
        <form onSubmit={submit} className="form-grid">
          <label>Name<input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></label>
          <label>Membership ID<input value={form.membershipId} onChange={(e) => setForm({...form, membershipId: e.target.value})} /></label>
          <label>Role<select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}><option>Member</option><option>Admin</option></select></label>
          <div className="form-action"><button className="primary-btn" type="submit">Add User</button></div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h3>Registered Users</h3><p>{users.length} account(s).</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td><td>{user.membershipId}</td><td><span className="tag">{user.role}</span></td>
                  <td><div className="action-group"><button className="small-btn" onClick={() => setEditing({...user})}>Update</button><button className="small-btn danger" disabled={currentUser.id === user.id} onClick={() => onDelete(user.id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <Modal title="Update User" onClose={() => setEditing(null)}>
          <form onSubmit={save} className="form-stack">
            <label>Name<input value={editing.name} onChange={(e) => setEditing({...editing, name: e.target.value})} /></label>
            <label>Membership ID<input value={editing.membershipId} onChange={(e) => setEditing({...editing, membershipId: e.target.value})} /></label>
            <label>Role<select value={editing.role} onChange={(e) => setEditing({...editing, role: e.target.value})}><option>Member</option><option>Admin</option></select></label>
            <button className="primary-btn" type="submit">Save Changes</button>
          </form>
        </Modal>
      )}
    </>
  );
}