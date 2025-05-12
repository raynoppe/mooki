import { Data } from "@measured/puck";
import { pagesClient } from "@/utils/supabase/pages";

// Fetch from Supabase by slug (path)
export const getPage = async (path: string): Promise<Data | null> => {
  try {
    const page = await pagesClient.getPageBySlug(path);
    return page?.content || null;
  } catch {
    return null;
  }
};
