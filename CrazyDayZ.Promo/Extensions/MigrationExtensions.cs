using CrazyDayZ.Promo.Persistence;
using Microsoft.EntityFrameworkCore;
using DbContext = CrazyDayZ.Promo.Persistence.DbContext;

namespace CrazyDayZ.Promo.Extensions;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using IServiceScope scope = app.ApplicationServices.CreateScope();

        using DbContext dbContext =
            scope.ServiceProvider.GetRequiredService<DbContext>();

        dbContext.Database.Migrate();
    }
}
