import { useEffect, useState, useRef } from "react";
import { Book } from './types/Books';

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortAscending, setSortAscending] = useState<boolean>(true);
    const [category, setCategory] = useState<string>("");
    const [cart, setCart] = useState<{ [bookId: number]: { book: Book; quantity: number } }>({});
    const [total, setTotal] = useState<number>(0);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [showCart, setShowCart] = useState<boolean>(false);
    const lastVisitedPage = useRef<number>(pageNum);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`http://localhost:5194/api/book?pageSize=${pageSize}&pageNum=${pageNum}&category=${category}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalItems(data.totalNumBooks)
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };

        fetchBooks();

    }, [pageSize, pageNum, category]);

    useEffect(() => {
        const newTotal = Object.values(cart).reduce((sum, item) => sum + item.book.price * item.quantity, 0);
        setTotal(newTotal);
    }, [cart]);

    return (
        <>
            {showToast && (
                <div className="toast show position-fixed top-0 end-0 m-3 bg-success text-white" role="alert">
                    <div className="toast-body">
                        {toastMessage}
                    </div>
                </div>
            )}
            <h1>Books</h1>
            <div className="mb-3">
                <button
                    className="btn btn-info mb-2"
                    type="button"
                    onClick={() => setShowCart(!showCart)}
                    aria-expanded={showCart}
                >
                    Toggle Cart Summary
                </button>

                <div className={`collapse ${showCart ? 'show' : ''}`}>
                    <div className="alert alert-info">
                        <h5>Cart Summary</h5>
                        {Object.keys(cart).length > 0 && (
                            <button className="btn btn-warning mb-3" onClick={() => setPageNum(lastVisitedPage.current)}>
                                Continue Shopping
                            </button>
                        )}
                        <ul className="list-unstyled mb-1">
                            {Object.values(cart).map(item => (
                                <li key={item.book.bookID}>
                                    {item.book.title} x {item.quantity} = ${ (item.book.price * item.quantity).toFixed(2) }
                                </li>
                            ))}
                        </ul>
                        <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
            <br />
            <div className="mb-3">
                <label className="form-label me-2">Filter by Category:</label>
                <select className="form-select w-auto d-inline" value={category} onChange={(e) => {
                    setCategory(e.target.value);
                    setPageNum(1); // reset to first page on category change
                }}>
                    <option value="">All</option>
                    <option value="Biography">Biography</option>
                    <option value="Classic">Classic</option>
                    <option value="Historical">Historical</option>
                    <option value="Self-Help">Self-Help</option>
                    <option value="Thrillers">Thrillers</option>
                    <option value="Business">Business</option>
                    <option value="Health">Health</option>
                    <option value="Christian Books">Christian Books</option>
                    <option value="Action">Action</option>
                </select>
            </div>
            <button className="btn btn-primary mb-3" onClick={() => setSortAscending(!sortAscending)}>
                Sort by Title {sortAscending ? "▲" : "▼"}
            </button>
            {
                [...books].sort((a, b) => {
                    if (a.title < b.title) return sortAscending ? -1 : 1;
                    if (a.title > b.title) return sortAscending ? 1 : -1;
                    return 0;
                }).length > 1 ? (
                    <div className="row align-items-stretch">
                        {[...books].sort((a, b) => {
                            if (a.title < b.title) return sortAscending ? -1 : 1;
                            if (a.title > b.title) return sortAscending ? 1 : -1;
                            return 0;
                        }).map((b) => (
                            <div key={b.bookID} className="col-sm-10 col-md-6 col-lg-4 mb-4">
                                <div className="card">
                                    <div className="card-body text-center" style={{ maxWidth: '100%' }}>
                                        <div className="mb-3">
                                            <h3 className="text-break">{b.title}</h3>
                                            <p><strong>Author:</strong> {b.author}</p>
                                            <p><strong>Publisher:</strong> {b.publisher}</p>
                                            <p><strong>ISBN:</strong> {b.isbn}</p>
                                            <p><strong>Classification:</strong> {b.classification}</p>
                                            <p><strong>Category:</strong> {b.category}</p>
                                            <p><strong>Pages:</strong> {b.pageCount}</p>
                                            <p><strong>Price:</strong> ${b.price.toFixed(2)}</p>
                                        </div>
                                        <button className="btn btn-success" onClick={() => {
                                            lastVisitedPage.current = pageNum;
                                            setCart(prev => {
                                                const existing = prev[b.bookID];
                                                const updated = {
                                                    ...prev,
                                                    [b.bookID]: {
                                                        book: b,
                                                        quantity: existing ? existing.quantity + 1 : 1
                                                    }
                                                };
                                                return updated;
                                            });
                                            setToastMessage(`Added "${b.title}" to cart`);
                                            setShowToast(true);
                                            setTimeout(() => setShowToast(false), 3000);
                                        }}>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    books.map((b) => (
                        <div key={b.bookID} className="mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <div className="card">
                                <div className="card-body text-center" style={{ maxWidth: '100%' }}>
                                    <div className="mb-3">
                                        <h3 className="text-break">{b.title}</h3>
                                        <p><strong>Author:</strong> {b.author}</p>
                                        <p><strong>Publisher:</strong> {b.publisher}</p>
                                        <p><strong>ISBN:</strong> {b.isbn}</p>
                                        <p><strong>Classification:</strong> {b.classification}</p>
                                        <p><strong>Category:</strong> {b.category}</p>
                                        <p><strong>Pages:</strong> {b.pageCount}</p>
                                        <p><strong>Price:</strong> ${b.price.toFixed(2)}</p>
                                    </div>
                                    <button className="btn btn-success" onClick={() => {
                                        lastVisitedPage.current = pageNum;
                                        setCart(prev => {
                                            const existing = prev[b.bookID];
                                            const updated = {
                                                ...prev,
                                                [b.bookID]: {
                                                    book: b,
                                                    quantity: existing ? existing.quantity + 1 : 1
                                                }
                                            };
                                            return updated;
                                        });
                                        setToastMessage(`Added "${b.title}" to cart`);
                                        setShowToast(true);
                                        setTimeout(() => setShowToast(false), 3000);
                                    }}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )
            }

            <button className="btn btn-secondary me-2" disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>
            {
                [...Array(totalPages)].map((_, i) => (
                    <button className="btn btn-outline-primary me-1" key={i + 1} onClick={() => setPageNum(i + 1)}>
                        {i + 1}
                    </button>
                ))
            }
            <button className="btn btn-secondary ms-2" disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

            <br />
            <label className="form-label mt-3">
                Results per page:
                <select className="form-select w-auto d-inline ms-2" value={pageSize} onChange={(b) => setPageSize(Number(b.target.value))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>
        </>
    );
}

export default BookList;