using Microsoft.EntityFrameworkCore;
using Mission11_Herrera.API.Data;

namespace Mission11_Herrera.Models
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
    }
}