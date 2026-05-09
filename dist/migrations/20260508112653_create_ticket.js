"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("tickets", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.enum("status", ["open", "in_progress", "closed"]).defaultTo("open");
        table.dateTime("created_at").defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists("tickets");
}
//# sourceMappingURL=20260508112653_create_ticket.js.map