import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { pagesClient } from "@/utils/supabase/pages";

export async function POST(request: Request) {
  const payload = await request.json();
  const { path, data } = payload;

  // Upsert page in Supabase
  try {
    // Try to find existing page by slug
    let page;
    try {
      page = await pagesClient.getPageBySlug(path);
    } catch {
      page = null;
    }

    if (page) {
      await pagesClient.updatePage(page.id, {
        content: data,
        updated_at: new Date().toISOString(),
      });
    } else {
      await pagesClient.createPage({
        title: path, // Placeholder, you may want to pass a real title
        slug: path,
        content: data,
        published: true, // Default to published for now
      });
    }

    // Purge Next.js cache
    revalidatePath(path);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: String(error) },
      { status: 500 }
    );
  }
}
