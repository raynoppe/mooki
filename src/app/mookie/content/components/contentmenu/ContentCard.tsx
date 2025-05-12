"use client";
import {
  BookCheck,
  Check,
  CopyPlus,
  File,
  Pencil,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { useState } from "react";

export type ContentCardProps = {
  cardType: string;
  badge1Text?: string;
  badge1Class?: string;
  published: boolean;
  contentId: string;
  title: string;
  lastDate: string;
  isNew?: boolean;
  editContent?: (cardType: string, contentId: string) => void;
  deleteContent?: (cardType: string, contentId: string) => void;
  copyContent?: (cardType: string, contentId: string) => void;
  addContent?: (cardType: string) => void;
};

const ContentCard = ({
  cardType,
  badge1Text,
  badge1Class,
  published,
  contentId,
  title,
  lastDate,
  editContent,
  deleteContent,
  copyContent,
  addContent,
  isNew,
}: ContentCardProps) => {
  const statusColour = published
    ? "text-white bg-green-700"
    : "text-white bg-gray-300";

  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <div className="w-[200px] border-1 border-gray-200 rounded p-1 bg-white shadow flex flex-col gap-1">
      <div className=" flex justify-end gap-1 pt-1">
        {badge1Text && (
          <Badge className={clsx(badge1Class, "text-white bg-blue-300")}>
            {badge1Text}
          </Badge>
        )}
        <Badge className={statusColour}>
          <>
            <BookCheck size={16} strokeWidth={1.5} />
          </>
        </Badge>
      </div>
      <div
        className={clsx(
          "flex flex-row justify-center h-[80px] items-center",
          "text-center font-bold",
          isNew && "text-gray-300"
        )}
      >
        {cardType === "page" && <File size={72} strokeWidth={1} />}
        {cardType === "video" && <Video size={72} strokeWidth={1} />}
      </div>
      <div className={clsx("text-center font-bold", isNew && "text-gray-300")}>
        {title}
      </div>
      <div className="text-xs text-center">{lastDate}</div>
      <div className="flex gap-3 justify-center p-2">
        {isNew && addContent && (
          <button
            className="bg-gray-100 p-2 rounded-full cursor-pointer"
            onClick={() => {
              addContent(cardType);
            }}
          >
            <Plus />
          </button>
        )}
        {!isNew && (
          <>
            {!confirmDelete && (
              <>
                {editContent && (
                  <button
                    className="bg-gray-100 p-2 rounded-full cursor-pointer"
                    onClick={() => {
                      editContent(cardType, contentId);
                    }}
                  >
                    <Pencil />
                  </button>
                )}
                {copyContent && (
                  <button
                    className="bg-gray-100 p-2 rounded-full cursor-pointer"
                    onClick={() => copyContent(cardType, contentId)}
                  >
                    <CopyPlus />
                  </button>
                )}
                {deleteContent && (
                  <button
                    className="bg-gray-100 p-2 rounded-full cursor-pointer"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 />
                  </button>
                )}
              </>
            )}
            {confirmDelete && (
              <>
                {deleteContent && (
                  <button
                    className="bg-gray-100 p-2 rounded-full cursor-pointer"
                    onClick={() => {
                      deleteContent(cardType, contentId);
                      setConfirmDelete(false);
                    }}
                  >
                    <Check />
                  </button>
                )}
                <button
                  className="bg-gray-100 p-2 rounded-full cursor-pointer"
                  onClick={() => setConfirmDelete(false)}
                >
                  <X />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ContentCard;
