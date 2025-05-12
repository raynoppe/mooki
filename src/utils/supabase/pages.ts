import { createClient } from "./client";
import type { Data } from "@measured/puck";

export interface Page {
  id: string;
  title: string;
  content: Data; // This will be your Puck editor JSON
  published: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
  author_id?: string;
  status?: string;
  description?: string;
  cover_image_url?: string;
  tags?: string[];
  updated_by_id?: string;
}

export const pagesClient = {
  async getPages() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Page[];
  },

  async getPage(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Page;
  },

  async createPage(page: Omit<Page, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .insert([page])
      .select()
      .single();

    if (error) throw error;
    return data as Page;
  },

  async updatePage(id: string, updates: Partial<Page>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Page;
  },

  async deletePage(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("pages").delete().eq("id", id);

    if (error) throw error;
  },

  async getPageBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return data as Page;
  },
};
