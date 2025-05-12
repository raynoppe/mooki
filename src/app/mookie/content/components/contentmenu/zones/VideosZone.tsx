"use client";

import { useState, useEffect } from "react";
import ContentZone, { CardItemData } from "../ContentZone";

const VideosZone = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CardItemData[]>([]);

  const handleAddContent = (cardType: string) => {
    // TODO: Implement video creation logic
    console.log("Adding new video");
  };

  const handleEditContent = (cardType: string, contentId: string) => {
    // TODO: Implement video edit logic
    console.log(`Editing video ${contentId}`);
  };

  const handleDeleteContent = (cardType: string, contentId: string) => {
    // TODO: Implement video deletion logic
    console.log(`Deleting video ${contentId}`);
  };

  const handleCopyContent = (cardType: string, contentId: string) => {
    // TODO: Implement video copy logic
    console.log(`Copying video ${contentId}`);
  };

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setItems([
        {
          cardType: "video",
          published: true,
          contentId: "v1",
          title: "Sample Video",
          lastDate: "1st May 2025",
          badge1Text: "Featured",
        },
        {
          cardType: "video",
          published: false,
          contentId: "v2",
          title: "Create New Video",
          lastDate: "---",
          isNew: true,
        },
      ]);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContentZone
      zoneTitle="Videos"
      items={items}
      loading={loading}
      onAddContent={handleAddContent}
      onEditContent={handleEditContent}
      onDeleteContent={handleDeleteContent}
      onCopyContent={handleCopyContent}
    />
  );
};

export default VideosZone;
