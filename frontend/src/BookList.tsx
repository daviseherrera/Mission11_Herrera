import { useEffect, useState } from "react";
import { Book } from './types/Books';

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortAscending, setSortAscending] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`http://localhost:5194/api/book?pageSize=${pageSize}&pageNum=${pageNum}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks)
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };

        fetchBooks();

    }, [pageSize, pageNum]);

    return (
        <>
            <h1>Books</h1>
            <br />
            <button className="btn btn-primary mb-3" onClick={() => setSortAscending(!sortAscending)}>
                Sort by Title {sortAscending ? "▲" : "▼"}
            </button>
            {[...books].sort((a, b) => {
                if (a.title < b.title) return sortAscending ? -1 : 1;
                if (a.title > b.title) return sortAscending ? 1 : -1;
                return 0;
            }).map((b) =>
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

            <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

            {
                [...Array(totalPages)].map((_, i) => (
                    <button key={i + 1} onClick={() => setPageNum(i + 1)}>
                        {i + 1}
                    </button>
            ))}

            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

            <br />
            <label>
                Results per page:
                <select value={pageSize} onChange={(b) => setPageSize(Number(b.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;