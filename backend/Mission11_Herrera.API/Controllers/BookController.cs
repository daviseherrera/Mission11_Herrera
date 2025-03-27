using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11_Herrera.Models;

namespace Mission11_Herrera.Controllers;

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
    public async Task<ActionResult<IEnumerable<Book>>> Get()
    {
        var books = await _context.Books.ToListAsync();
        return Ok(books);
    }
}