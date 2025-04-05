using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Herrera.API.Data;
using Mission11_Herrera.Models;

namespace Mission11_Herrera.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly BookDbContext _context;

    public BookController(BookDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get(int pageSize = 10, int pageNum = 1, string? category = null)
    {
        var query = _context.Books.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        var totalBooks = query.Count();

        var books = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new
        {
            books = books,
            totalNumBooks = totalBooks
        });
    }

    [HttpPost]
    public IActionResult AddBook([FromBody] Book book)
    {
        if (book == null)
        {
            return BadRequest("Invalid book data.");
        }

        // Ensure price is correctly being passed and is valid
        if (book.Price <= 0)
        {
            return BadRequest("Price must be greater than 0.");
        }


        _context.Books.Add(book);
        _context.SaveChanges();

        return CreatedAtAction(nameof(Get), new { id = book.BookID }, book); // Return the created book
    }

    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookID)
        {
            return BadRequest("Book ID mismatch.");
        }

        var existingBook = _context.Books.Find(id);
        if (existingBook == null)
        {
            return NotFound("Book not found.");
        }
        
        // Ensure price is updated correctly
        if (book.Price <= 0)
        {
            return BadRequest("Price must be greater than 0.");
        }

        // Update book properties
        existingBook.Title = book.Title;
        existingBook.Author = book.Author;
        existingBook.Publisher = book.Publisher;
        existingBook.ISBN = book.ISBN;
        existingBook.Classification = book.Classification;
        existingBook.Category = book.Category;
        existingBook.PageCount = book.PageCount;
        existingBook.Price = book.Price;

        _context.SaveChanges();

        return NoContent(); // Successfully updated
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        if (book == null)
        {
            return NotFound("Book not found.");
        }

        _context.Books.Remove(book);
        _context.SaveChanges();

        return NoContent(); // Successfully deleted
    }
}