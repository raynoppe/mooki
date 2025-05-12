"use client";

import { useAdminContext } from "../../context/AdminContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { pagesClient } from "@/utils/supabase/pages";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  cover_image_url: "",
  tags: "",
  status: "draft",
};

const AdminSheet = () => {
  const { isSheetOpen, sheetMode, sheetContentType, closeSheet, refreshPages } =
    useAdminContext();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when opening for add page
  useEffect(() => {
    if (isSheetOpen && sheetMode === "add" && sheetContentType === "page") {
      setForm(initialForm);
      setError(null);
    }
  }, [isSheetOpen, sheetMode, sheetContentType]);

  // Auto-generate slug from title
  useEffect(() => {
    if (sheetMode === "add" && sheetContentType === "page") {
      setForm((prev) => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 64),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title]);

  const isValid = form.title.trim() !== "" && form.slug.trim() !== "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      await pagesClient.createPage({
        title: form.title,
        slug: form.slug,
        description: form.description,
        cover_image_url: form.cover_image_url,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: form.status,
        content: {
          root: { props: {}, type: "root", content: [] },
          content: [],
        }, // Minimal valid Puck Data
        published: form.status === "published",
      });
      setLoading(false);
      if (refreshPages) refreshPages();
      closeSheet();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Failed to create page");
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
      <SheetContent
        side="right"
        className="bg-white flex flex-col h-full p-0 gap-0 z-[9999]"
      >
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle>
            {sheetMode === "add" &&
              sheetContentType === "page" &&
              "Add New Page"}
          </SheetTitle>
        </SheetHeader>
        {sheetMode === "add" && sheetContentType === "page" && (
          <form
            className="flex flex-col flex-grow h-[calc(100vh-138px)]"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="flex flex-col flex-grow gap-4 overflow-y-auto p-4">
              <input
                type="text"
                name="title"
                placeholder="Page Title *"
                className="border rounded px-3 py-2"
                value={form.title}
                onChange={handleChange}
                required
                autoFocus
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug *"
                className="border rounded px-3 py-2"
                value={form.slug}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="border rounded px-3 py-2 min-h-[100px]"
                value={form.description}
                onChange={handleChange}
              />
              <input
                type="text"
                name="cover_image_url"
                placeholder="Cover Image URL"
                className="border rounded px-3 py-2"
                value={form.cover_image_url}
                onChange={handleChange}
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                className="border rounded px-3 py-2"
                value={form.tags}
                onChange={handleChange}
              />
              <select
                name="status"
                className="border rounded px-3 py-2"
                value={form.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              {error && <div className="text-red-600 text-sm">{error}</div>}
            </div>
            <div className="p-4 flex border-t border-gray-200">
              <Button
                variant="default"
                type="submit"
                className="w-full"
                disabled={!isValid || loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
        <div className="px-4 pb-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full m-0">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminSheet;
