import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table
      .integer('role_id') // ถ้า roles.id ใช้ uuid() แทน increments() => users.role_id ก็ต้องเป็น .uuid('role_id') ไม่ใช่ .integer()
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.string('googleId', 25).unique().nullable();
    table.string('email', 50).notNullable();

    table.boolean('isActive').notNullable().defaultTo(true);
    table.integer('hasSentEmail').notNullable().defaultTo(0);

    table.text('refreshTokenEncrypted').unique().nullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
