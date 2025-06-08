import { Part } from "./PartsRepository";
import { Port } from "./PortsRepository";
import { Installation } from "./InstallationsRepository";
import { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "../../utils/supabase/client";

export type Item = {
  id: string;
  name: string | null;
  type: string | null;
  description: string | null;
  password: string | null;
  condition: string | null;
  source: string | null;
  provider: string | null;
  note: string | null;

  created_at: string;

  installations: Installation[];
  ports: Port[];
  parts: Part[];
  missings: Part[];
};

export default class ItemsRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createSupabaseBrowserClient();
  }

  // ----- View-based reads -----

  async getAll(): Promise<{ data: Item[] | null; error: Error | null }> {
    return await this.supabase.from("view_items").select("*");
  }

  async getById(id: string): Promise<{ data: Item | null; error: Error | null }> {
    return await this.supabase.from("view_items").select("*").eq("id", id).single();
  }

  // ----- Items -----

  async insert(item: Omit<Item, "created_at" | "ports" | "parts" | "missings" | "installations">) {
    return await this.supabase.from("items").insert(item).select().single();
  }

  async update(id: string, updates: Partial<Omit<Item, "ports" | "parts" | "missings">>) {
    return await this.supabase.from("items").update(updates).eq("id", id).select().single();
  }

  async delete(id: string) {
    return await this.supabase.from("items").delete().eq("id", id).select().single();
  }

  // ----- Generic linking helpers -----
  private linkMany(table: string, itemId: string, key: string, ids: Set<string>) {
    const inserts = Array.from(ids).map((val) => ({
      item_id: itemId,
      [key]: val,
    }));
    return this.supabase.from(table).insert(inserts);
  }

  private unlinkAll(table: string, itemId: string) {
    return this.supabase.from(table).delete().match({ item_id: itemId });
  }

  private linkOne(table: string, itemId: string, key: string, value: string) {
    return this.supabase.from(table).insert({ item_id: itemId, [key]: value });
  }

  private unlinkOne(table: string, itemId: string, key: string, value: string) {
    return this.supabase
      .from(table)
      .delete()
      .match({ item_id: itemId, [key]: value });
  }

  // ----- Linking: item_ports -----
  async unlinkItemFromAllPort(itemId: string) {
    return this.unlinkAll("item_ports", itemId);
  }

  async linkItemToAllPort(itemId: string, portIds: Set<string>) {
    return this.linkMany("item_ports", itemId, "port", portIds);
  }

  // ----- Linking: item_parts -----
  async unlinkItemFromAllPart(itemId: string) {
    return this.unlinkAll("item_parts", itemId);
  }

  async linkItemToAllPart(itemId: string, partIds: Set<string>) {
    return this.linkMany("item_parts", itemId, "part", partIds);
  }

  // ----- Linking: item_missings -----
  async unlinkItemFromAllMissing(itemId: string) {
    return this.unlinkAll("item_missings", itemId);
  }

  async linkItemToAllMissing(itemId: string, missingIds: Set<string>) {
    return this.linkMany("item_missings", itemId, "part", missingIds);
  }

  // ----- Linking: item_installations -----
  async unlinkItemFromAllInstallation(itemId: string) {
    return this.unlinkAll("item_installations", itemId);
  }

  async linkItemToAllInstallation(itemId: string, installationIds: Set<string>) {
    return this.linkMany("item_installations", itemId, "installation", installationIds);
  }
}
