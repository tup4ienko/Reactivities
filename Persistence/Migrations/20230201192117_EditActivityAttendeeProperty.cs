using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class EditActivityAttendeeProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityAttendees_Activities_ActiivityId",
                table: "ActivityAttendees");

            migrationBuilder.RenameColumn(
                name: "ActiivityId",
                table: "ActivityAttendees",
                newName: "ActivityId");

            migrationBuilder.RenameIndex(
                name: "IX_ActivityAttendees_ActiivityId",
                table: "ActivityAttendees",
                newName: "IX_ActivityAttendees_ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityAttendees_Activities_ActivityId",
                table: "ActivityAttendees",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityAttendees_Activities_ActivityId",
                table: "ActivityAttendees");

            migrationBuilder.RenameColumn(
                name: "ActivityId",
                table: "ActivityAttendees",
                newName: "ActiivityId");

            migrationBuilder.RenameIndex(
                name: "IX_ActivityAttendees_ActivityId",
                table: "ActivityAttendees",
                newName: "IX_ActivityAttendees_ActiivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityAttendees_Activities_ActiivityId",
                table: "ActivityAttendees",
                column: "ActiivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
