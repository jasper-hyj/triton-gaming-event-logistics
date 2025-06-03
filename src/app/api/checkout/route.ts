import { db } from '@/lib/db';
import { logs, items } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { itemId, user } = body;

  const item = await db.select().from(items).where(eq(items.id, itemId));
  if (item.length === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  await db.insert(logs).values({
    id: uuid(),
    itemId,
    user,
    action: 'checkout',
    timestamp: new Date().toISOString(),
  });
  await db.update(items).set({ available: item[0].available - 1 }).where(eq(items.id, itemId));
  return NextResponse.json({ success: true });
}