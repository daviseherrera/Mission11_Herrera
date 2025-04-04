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
}