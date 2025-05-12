"use client";

import React from "react";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";

// Define the shape of the item data ContentZone expects
export interface CardItemData {
  cardType: string;
  published: boolean;
  contentId: string;
  title: string;
  lastDate: string;
  isNew?: boolean;
  badge1Text?: string;
  badge1Class?: string;
}

interface ContentZoneProps {
  zoneTitle: string;
  items?: CardItemData[];
  loading: boolean;
  onAddContent?: (cardType: string) => void;
  onEditContent?: (cardType: string, contentId: string) => void;
  onDeleteContent?: (cardType: string, contentId: string) => void;
  onCopyContent?: (cardType: string, contentId: string) => void;
}

const ContentZone: React.FC<ContentZoneProps> = ({
  zoneTitle,
  items = [],
  loading,
  onAddContent,
  onEditContent,
  onDeleteContent,
  onCopyContent,
}) => {
  // Determine how many skeletons to show, e.g., based on expected items or a fixed number
  const skeletonCount = items.length > 0 ? items.length : 2; // Default to 2 if no items yet

  return (
    <div className="flex w-full shadow flex-col bg-white rounded-lg">
      <div className="p-3 border-b-1 border-gray-200">
        <div className="flex flex-row justify-between">
          <div>{zoneTitle}</div>
          <div>
            <button className="text-sm p-1 pl-2 pr-2 bg-gray-600 text-white rounded">
              Add Content
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 w-full p-4 overflow-y-auto">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))
          : items.map((item) => (
              <ContentCard
                key={item.contentId || item.title}
                cardType={item.cardType}
                published={item.published}
                contentId={item.contentId}
                title={item.title}
                lastDate={item.lastDate}
                isNew={item.isNew}
                badge1Text={item.badge1Text}
                badge1Class={item.badge1Class}
                addContent={
                  item.isNew && onAddContent
                    ? () => onAddContent(item.cardType)
                    : undefined
                }
                editContent={
                  onEditContent
                    ? () => onEditContent(item.cardType, item.contentId)
                    : undefined
                }
                deleteContent={
                  onDeleteContent
                    ? () => onDeleteContent(item.cardType, item.contentId)
                    : undefined
                }
                copyContent={
                  onCopyContent
                    ? () => onCopyContent(item.cardType, item.contentId)
                    : undefined
                }
              />
            ))}
      </div>
    </div>
  );
};

export default ContentZone;
