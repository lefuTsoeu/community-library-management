import { Link } from "react-router-dom";

export default function Dashboard({ books, users, transactions }) {
  const totalCopies = books.reduce((sum, book) => sum + book.quantity, 0);
  const lowStock = books.filter((book) => book.quantity < 2);

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="muted">Monitor your community library at a glance.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><span>Total Titles</span><strong>{books.length}</strong><small>Books in catalogue</small></div>
        <div className="stat-card"><span>Copies in Stock</span><strong>{totalCopies}</strong><small>Currently available</small></div>
        <div className="stat-card"><span>Registered Users</span><strong>{users.length}</strong><small>Library accounts</small></div>
        <div className="stat-card warning"><span>Low Stock</span><strong>{lowStock.length}</strong><small>Fewer than 2 copies</small></div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-heading">
            <div><h3>Current Book Availability</h3><p>Books with fewer than 2 copies are highlighted.</p></div>
            <Link className="text-link" to="/books">Manage books →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Availability</th></tr></thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className={book.quantity < 2 ? "low-row" : ""}>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td><span className="tag">{book.genre}</span></td>
                    <td>{book.isbn}</td>
                    <td><span className={`stock ${book.quantity < 2 ? "low" : "ok"}`}>{book.quantity} copies</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div><h3>Recent Activity</h3><p>Latest stock transactions.</p></div>
          </div>
          {transactions.length === 0 ? (
            <div className="empty-state">No transactions recorded yet.</div>
          ) : (
            <div className="activity-list">
              {transactions.slice(0, 6).map((tx) => (
                <div className="activity" key={tx.id}>
                  <div className="activity-icon">{tx.type === "Added Stock" ? "+" : "−"}</div>
                  <div><strong>{tx.type}</strong><span>{tx.bookTitle} · {tx.amount} copy/copies</span><small>{tx.date}</small></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}