using Microsoft.EntityFrameworkCore;
using Mission11_Herrera.Models;

namespace Mission11_Herrera.API.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        // Adding the OnModelCreating method to configure the schema
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");  // Ensures that price is stored as a decimal with two decimal places

            // You can add more configurations for other fields if needed
        }
    }
}