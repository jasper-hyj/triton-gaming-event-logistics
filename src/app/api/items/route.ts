import ItemsRepository from "@/lib/repositories/ItemsRepository";

export async function GET() {
  const itemsRepo = new ItemsRepository();
  const { data, error } = await itemsRepo.getAll();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ items: data });
}
