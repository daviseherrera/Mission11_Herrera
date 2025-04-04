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
    public IActionResult Get(int pageSize = 10, int pageNum = 1)
    {
        var totalBooks = _context.Books.Count();

        var books = _context.Books
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