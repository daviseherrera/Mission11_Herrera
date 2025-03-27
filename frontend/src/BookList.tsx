import { useEffect, useState } from "react";
import { Book } from './types/Books';

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch('http://localhost:5194/api/book');
            const data = await response.json();
            setBooks(data);
        };

        fetchBooks();

    }, []);

    return (
        <>
            <h1>Books</h1>
            <br />
            {books.map((b) =>
                <div key={b.bookID} id="bookCard" style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    marginBottom: '1rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
                }}>
                    <h3>{b.title}</h3>
                    <p><strong>Author:</strong> {b.author}</p>
                    <p><strong>Publisher:</strong> {b.publisher}</p>
                    <p><strong>ISBN:</strong> {b.isbn}</p>
                    <p><strong>Classification:</strong> {b.classification}</p>
                    <p><strong>Category:</strong> {b.category}</p>
                    <p><strong>Pages:</strong> {b.pageCount}</p>
                    <p><strong>Price:</strong> ${b.price.toFixed(2)}</p>
                </div>
        )}
        </>
    );
}

export default BookList;