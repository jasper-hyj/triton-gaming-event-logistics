import { db } from '@/lib/db';
import { items } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: { item: string } }) {
  const { item } = context.params;
  const result = await db.select().from(items).where(eq(items.id, item));
  if (result.length === 0) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json(result[0]);
}