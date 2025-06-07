import { NextRequest, NextResponse } from "next/server";
import ItemsRepository from "@/lib/repositories/ItemsRepository";

type Context = {
  params: Promise<{
    itemId: string;
  }>;
};

export async function GET(_req: NextRequest, { params }: Context) {
  const { itemId } = await params;

  const itemsRepo = new ItemsRepository();

  const { data: item, error } = await itemsRepo.getById(itemId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ item });
}
