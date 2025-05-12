"use client";

import { useState, useEffect, useCallback } from "react";
import ContentZone, { CardItemData } from "../ContentZone";
import { useAdminContext } from "@/app/mookie/context/AdminContext";
import { pagesClient } from "@/utils/supabase/pages";

const PagesZone = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CardItemData[]>([]);
  const {
    addContent,
    editContent,
    deleteContent,
    copyContent,
    isSheetOpen,
    sheetMode,
    sheetContentType,
    setRefreshPages,
  } = useAdminContext();

  // Fetch pages from Supabase
  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const pages = await pagesClient.getPages();
      const mapped: CardItemData[] = pages.map((page) => ({
        cardType: "page",
        published: page.published,
        contentId: page.id,
        title: page.title,
        lastDate: page.updated_at
          ? new Date(page.updated_at).toLocaleDateString()
          : "---",
        badge1Text: page.status === "draft" ? "Draft" : undefined,
        badge1Class: page.status === "draft" ? "bg-yellow-500" : undefined,
      }));
      // Add the "Create New Page" card at the end
      mapped.push({
        cardType: "page",
        published: false,
        contentId: "new",
        title: "Create New Page",
        lastDate: "---",
        isNew: true,
      });
      setItems(mapped);
    } catch (err) {
      setItems([]);
    }
    setLoading(false);
  }, []);

  // Fetch on mount and when sheet closes after add
  useEffect(() => {
    // Only refetch if sheet just closed after add
    if (!isSheetOpen && sheetMode === "add" && sheetContentType === "page") {
      fetchPages();
    }
  }, [isSheetOpen, sheetMode, sheetContentType, fetchPages]);

  // Initial fetch
  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Register refreshPages with context
  useEffect(() => {
    if (setRefreshPages) {
      setRefreshPages(fetchPages);
    }
  }, [setRefreshPages, fetchPages]);

  return (
    <ContentZone
      zoneTitle="Pages / Articles"
      items={items}
      loading={loading}
      onAddContent={addContent}
      onEditContent={editContent}
      onDeleteContent={deleteContent}
      onCopyContent={copyContent}
    />
  );
};

export default PagesZone;
