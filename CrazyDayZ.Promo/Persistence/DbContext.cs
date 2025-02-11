using CrazyDayZ.Promo.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CrazyDayZ.Promo.Models;

namespace CrazyDayZ.Promo.Persistence;

public class DbContext : IdentityDbContext<User, IdentityRole, string>
{
    public DbSet<Image> Images { get; set; }

    public DbContext(DbContextOptions<DbContext> options)
       : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
