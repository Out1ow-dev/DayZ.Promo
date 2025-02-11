using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrazyDayZ.Promo.Migrations
{
    /// <inheritdoc />
    public partial class AddImageGenerate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FinalImagePath",
                table: "Images",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FinalImagePath",
                table: "Images");
        }
    }
}
