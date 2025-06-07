import { User } from "@supabase/supabase-js";
import UsersRepository from "./repositories/UsersRepository";

export async function getUserServer(): Promise<User | undefined> {
  const repo = await UsersRepository.createServer();
  return repo.getBySession();
}
