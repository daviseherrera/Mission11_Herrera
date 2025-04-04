import React, { useEffect, useState } from 'react';

type Book = {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
};

const AdminBookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    price: 0
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

  useEffect(() => {
    fetch('http://localhost:5194/api/book')
      .then(res => res.json())
      .then(data => {
        setBooks(data.books);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editBook) {
      setEditBook(prevState => ({
        ...prevState!,
        [name]: value
      }));
    } else {
      setNewBook(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    fetch('http://localhost:5194/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    })
    .then(res => res.json())
    .then(data => {
      setBooks(prevBooks => [...prevBooks, data]); // Add the new book to the list
      setNewBook({ title: '', author: '', category: '', price: 0 }); // Clear the form
    });
  };

  const handleEdit = (bookID: number) => {
  const bookToEdit = books.find(book => book.bookID === bookID);
  if (bookToEdit) {
    setEditBook(bookToEdit); // Only set editBook if it's not undefined
  } else {
    setEditBook(null); // In case no book is found, set editBook to null
  }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editBook) return;

    fetch(`http://localhost:5194/api/book/${editBook.bookID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editBook),
    }).then(res => res.json()).then(updatedBook => {
      setBooks(prevBooks => prevBooks.map(book => book.bookID === updatedBook.bookID ? updatedBook : book));
      setEditBook(null); // Reset editing state
    });
  };

  const handleDelete = (bookID: number) => {
    fetch(`http://localhost:5194/api/book/${bookID}`, {
      method: 'DELETE',
    }).then(() => {
      setBooks(prev => prev.filter(book => book.bookID !== bookID));
    });
  };

  return (
    <div className="container mt-4">
      <h1>Admin Book Manager</h1>
      <div className="mb-3">
        <h2>{editBook ? 'Edit Book' : 'Add a New Book'}</h2>
        <form onSubmit={editBook ? handleEditSubmit : handleAddBook}>
          <div className="mb-2">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={editBook?.title || newBook.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Author</label>
            <input
              type="text"
              className="form-control"
              name="author"
              value={editBook?.author || newBook.author}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={editBook?.category || newBook.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-2">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={editBook?.price || newBook.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">{editBook ? 'Update Book' : 'Add Book'}</button>
        </form>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.bookID}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(book.bookID)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.bookID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookList;