import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

const initialBooks = [
  { id: 1, title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "9780385474542", quantity: 5 },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Adventure", isbn: "9780062315007", quantity: 1 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", genre: "Technology", isbn: "9780132350884", quantity: 3 }
];

const initialUsers = [
  { id: 1, name: "Library Admin", membershipId: "ADMIN001", role: "Admin" },
  { id: 2, name: "John Student", membershipId: "MEM001", role: "Member" }
];

function getStored(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [books, setBooks] = useState(() => getStored("library_books", initialBooks));
  const [users, setUsers] = useState(() => getStored("library_users", initialUsers));
  const [transactions, setTransactions] = useState(() => getStored("library_transactions", []));
  const [currentUser, setCurrentUser] = useState(() => getStored("library_current_user", null));

  useEffect(() => {
    localStorage.setItem("library_books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("library_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("library_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("library_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("library_current_user");
    }
  }, [currentUser]);

  const login = (membershipId) => {
    const found = users.find(
      (user) => user.membershipId.toLowerCase() === membershipId.trim().toLowerCase()
    );
    if (!found) return false;
    setCurrentUser(found);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addBook = (book) => {
    setBooks((prev) => [...prev, { ...book, id: Date.now(), quantity: Number(book.quantity) }]);
  };

  const updateBook = (updated) => {
    setBooks((prev) => prev.map((book) => book.id === updated.id ? { ...updated, quantity: Number(updated.quantity) } : book));
  };

  const deleteBook = (id) => setBooks((prev) => prev.filter((book) => book.id !== id));

  const changeStock = (bookId, amount, type) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return { ok: false, message: "Book not found." };

    const newQuantity = book.quantity + amount;
    if (newQuantity < 0) return { ok: false, message: "Cannot deduct more copies than are in stock." };

    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, quantity: newQuantity } : b));
    setTransactions((prev) => [
      {
        id: Date.now(),
        bookId,
        bookTitle: book.title,
        type,
        amount: Math.abs(amount),
        date: new Date().toLocaleString()
      },
      ...prev
    ]);
    return { ok: true };
  };

  const addUser = (user) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
  };

  const updateUser = (updated) => {
    setUsers((prev) => prev.map((user) => user.id === updated.id ? updated : user));
    if (currentUser?.id === updated.id) setCurrentUser(updated);
  };

  const deleteUser = (id) => {
    if (currentUser?.id === id) return false;
    setUsers((prev) => prev.filter((user) => user.id !== id));
    return true;
  };

  if (!currentUser) {
    return <Login users={users} onLogin={login} />;
  }

  return (
    <Layout currentUser={currentUser} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Dashboard books={books} users={users} transactions={transactions} />} />
        <Route path="/books" element={
          <Books books={books} onAdd={addBook} onUpdate={updateBook} onDelete={deleteBook} />
        } />
        <Route path="/transactions" element={
          <Transactions books={books} transactions={transactions} onStockChange={changeStock} />
        } />
        <Route path="/users" element={
          <Users users={users} currentUser={currentUser} onAdd={addUser} onUpdate={updateUser} onDelete={deleteUser} />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}