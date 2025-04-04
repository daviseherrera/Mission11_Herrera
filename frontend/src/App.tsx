import './App.css';
import BookList from './BookList';
import AdminBookList from './AdminBookList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/adminbooks" element={<AdminBookList />} />
      </Routes>
    </Router>
  )
}

export default App
