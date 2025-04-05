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
  const [books, setBooks] = useState<Book[]>([]); // To store the fetched books
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    price: 0
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

  useEffect(() => {
    // Fetch all books from the API
    fetch('http://localhost:5194/api/book')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched books:', data.books);  // Log the fetched books
        setBooks(data.books);  // Set the state with all books
      })
      .catch(error => console.error('Error fetching books:', error));  // Error handling
  }, []); // Runs only once when the component mounts

  // Handle input changes for both adding and editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (editBook) {
      setEditBook(prevState => ({
        ...prevState!,
        [name]: name === 'price' ? parseFloat(value) : value // Ensure price is a number
      }));
    } else {
      setNewBook(prevState => ({
        ...prevState,
        [name]: name === 'price' ? parseFloat(value) : value // Ensure price is a number
      }));
    }
  };

  // Handle adding a new book
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Adding new book:', newBook); // Log to verify data
    fetch('http://localhost:5194/api/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBook)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Added book:', data); // Log the added book response
      setBooks(prevBooks => [...prevBooks, data]);  // Add new book to the list
      setNewBook({ title: '', author: '', category: '', price: 0 });  // Clear form
    })
    .catch(error => console.error('Error adding book:', error));  // Error handling
  };

  // Handle editing a book
  const handleEdit = (bookID: number) => {
    const bookToEdit = books.find(book => book.bookID === bookID);
    if (bookToEdit) {
      setEditBook(bookToEdit); // Set book to edit
    } else {
      setEditBook(null);  // If no book found, set to null
    }
  };

  // Handle updating the book
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Updating book:', editBook); // Log to verify data
    if (!editBook) return;

    fetch(`http://localhost:5194/api/book/${editBook.bookID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editBook),
    })
    .then(res => res.json())
    .then(updatedBook => {
      console.log('Updated book:', updatedBook);  // Log updated book
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.bookID === updatedBook.bookID ? updatedBook : book
        )
      );
      setEditBook(null);  // Reset editing state
    })
    .catch(error => console.error('Error updating book:', error));  // Error handling
  };

  // Handle deleting a book
  const handleDelete = (bookID: number) => {
    fetch(`http://localhost:5194/api/book/${bookID}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(() => {
      setBooks(prev => prev.filter(book => book.bookID !== bookID));  // Remove deleted book from the list
    })
    .catch(error => console.error('Error deleting book:', error));  // Error handling
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