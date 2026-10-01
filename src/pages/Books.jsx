import { useState } from "react";
import Modal from "../components/Modal";

const blankBook = { title: "", author: "", genre: "", isbn: "", quantity: 1 };

export default function Books({ books, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(blankBook);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const filtered = books.filter((book) =>
    [book.title, book.author, book.genre, book.isbn].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !form.isbn.trim()) {
      setError("Please complete all book fields.");
      return;
    }
    if (Number(form.quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
    onAdd(form);
    setForm(blankBook);
    setError("");
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editing.title.trim() || !editing.author.trim() || !editing.genre.trim() || !editing.isbn.trim()) {
      setError("Please complete all book fields.");
      return;
    }
    onUpdate(editing);
    setEditing(null);
    setError("");
  };

  return (
    <>
      <section className="page-heading">
        <div><p className="eyebrow">CATALOGUE</p><h1>Book Management</h1><p className="muted">Add, update and remove books from the library catalogue.</p></div>
      </section>

      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>Add New Book</h3><p>Enter the required book information.</p></div></div>
        <form onSubmit={submit} className="form-grid">
          <label>Title<input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} /></label>
          <label>Author<input value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} /></label>
          <label>Genre<input value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} /></label>
          <label>ISBN<input value={form.isbn} onChange={(e) => setForm({...form, isbn: e.target.value})} /></label>
          <label>Initial Quantity<input type="number" min="0" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} /></label>
          <div className="form-action"><button className="primary-btn" type="submit">Add Book</button></div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><h3>Library Catalogue</h3><p>{books.length} title(s) registered.</p></div>
          <input className="search-input" placeholder="Search books..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className={book.quantity < 2 ? "low-row" : ""}>
                  <td><strong>{book.title}</strong></td><td>{book.author}</td><td><span className="tag">{book.genre}</span></td><td>{book.isbn}</td>
                  <td><span className={`stock ${book.quantity < 2 ? "low" : "ok"}`}>{book.quantity}</span></td>
                  <td><div className="action-group"><button className="small-btn" onClick={() => {setEditing({...book}); setError("");}}>Update</button><button className="small-btn danger" onClick={() => onDelete(book.id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <Modal title="Update Book" onClose={() => setEditing(null)}>
          <form onSubmit={saveEdit} className="form-stack">
            <label>Title<input value={editing.title} onChange={(e) => setEditing({...editing, title: e.target.value})} /></label>
            <label>Author<input value={editing.author} onChange={(e) => setEditing({...editing, author: e.target.value})} /></label>
            <label>Genre<input value={editing.genre} onChange={(e) => setEditing({...editing, genre: e.target.value})} /></label>
            <label>ISBN<input value={editing.isbn} onChange={(e) => setEditing({...editing, isbn: e.target.value})} /></label>
            <label>Quantity<input type="number" min="0" value={editing.quantity} onChange={(e) => setEditing({...editing, quantity: e.target.value})} /></label>
            <button className="primary-btn" type="submit">Save Changes</button>
          </form>
        </Modal>
      )}
    </>
  );
}