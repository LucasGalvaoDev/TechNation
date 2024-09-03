using Microsoft.EntityFrameworkCore;
using TechNationEx.Models;

namespace TechNationEx.Data
{
    public class FiscalDbContext : DbContext
    {
        public FiscalDbContext(DbContextOptions<FiscalDbContext> options) : base(options) { }

        public DbSet<NotaFiscal> NotaFiscal { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NotaFiscal>()
                .Property(nf => nf.Valor)
                .HasColumnType("decimal(18,2)");
        }

    }
}
