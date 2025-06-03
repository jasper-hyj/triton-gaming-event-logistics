import { pgTable, text, integer } from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  box: text('box'),
  available: integer('available').notNull(),
  guideUrl: text('guide_url'),
});

export const logs = pgTable('logs', {
  id: text('id').primaryKey(),
  itemId: text('item_id').notNull(),
  user: text('user').notNull(),
  action: text('action').notNull(),
  timestamp: text('timestamp').notNull(),
});
