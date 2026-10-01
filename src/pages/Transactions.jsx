import { useState } from "react";

export default function Transactions({ books, transactions, onStockChange }) {
  const [bookId, setBookId] = useState(books[0]?.id || "");
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState("");

  const submit = (type) => {
    if (!bookId || Number(amount) < 1) {
      setMessage("Select a book and enter a valid quantity.");
      return;
    }
    const result = onStockChange(Number(bookId), type === "Added Stock" ? Number(amount) : -Number(amount), type);
    setMessage(result.ok ? `${type} recorded successfully.` : result.message);
  };

  return (
    <>
      <section className="page-heading">
        <div><p className="eyebrow">INVENTORY</p><h1>Transactions</h1><p className="muted">Add stock when books arrive and deduct stock when books are borrowed.</p></div>
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h3>Stock Transaction</h3><p>Update the available quantity of a book.</p></div></div>
        <div className="transaction-form">
          <label>Book
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              {books.map((book) => <option key={book.id} value={book.id}>{book.title} — {book.quantity} in stock</option>)}
            </select>
          </label>
          <label>Quantity<input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          <div className="transaction-buttons">
            <button className="primary-btn" onClick={() => submit("Added Stock")}>+ Add Stock</button>
            <button className="secondary-btn" onClick={() => submit("Borrowed")}>− Deduct / Borrow</button>
          </div>
        </div>
        {message && <div className="success-message">{message}</div>}
      </section>

      <section className="panel">
        <div className="panel-heading"><div><h3>Transaction History</h3><p>Complete record of stock movements.</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Book</th><th>Transaction</th><th>Quantity</th></tr></thead>
            <tbody>
              {transactions.length === 0 ? <tr><td colSpan="4" className="empty-cell">No transactions recorded yet.</td></tr> :
                transactions.map((tx) => <tr key={tx.id}><td>{tx.date}</td><td><strong>{tx.bookTitle}</strong></td><td><span className={`transaction-tag ${tx.type === "Added Stock" ? "add" : "borrow"}`}>{tx.type}</span></td><td>{tx.amount}</td></tr>)
              }
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}