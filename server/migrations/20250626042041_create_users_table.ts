import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable().unique();
    table
      .uuid('role_id')
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.string('googleId', 25).unique().nullable();
    table.string('fullName', 100).notNullable();
    table.string('email', 50).notNullable();

    table.boolean('isActive').notNullable().defaultTo(true);
    table.boolean('hasSentEmail').notNullable().defaultTo(false);

    table.text('refreshTokenEncrypted').unique().nullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
