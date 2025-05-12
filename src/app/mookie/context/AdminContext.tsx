"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

export type SheetMode = "add" | "edit";
export type SheetContentType = "page" | "video" | "social" | string;

interface AdminContextType {
  addContent: (cardType: string) => void;
  editContent: (cardType: string, contentId: string) => void;
  deleteContent: (cardType: string, contentId: string) => void;
  copyContent: (cardType: string, contentId: string) => void;
  // Sheet state and actions
  isSheetOpen: boolean;
  sheetMode: SheetMode | null;
  sheetContentType: SheetContentType | null;
  sheetZone: string | null;
  sheetItemId: string | null;
  openSheet: (options: {
    mode: SheetMode;
    contentType: SheetContentType;
    zone?: string;
    itemId?: string;
  }) => void;
  closeSheet: () => void;
  refreshPages?: () => void;
  setRefreshPages?: (fn: () => void) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode | null>(null);
  const [sheetContentType, setSheetContentType] =
    useState<SheetContentType | null>(null);
  const [sheetZone, setSheetZone] = useState<string | null>(null);
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [refreshPages, setRefreshPagesState] = useState<
    (() => void) | undefined
  >(undefined);

  const setRefreshPages = (fn: () => void) => setRefreshPagesState(() => fn);

  const openSheet = ({
    mode,
    contentType,
    zone = null,
    itemId = null,
  }: {
    mode: SheetMode;
    contentType: SheetContentType;
    zone?: string;
    itemId?: string;
  }) => {
    setSheetMode(mode);
    setSheetContentType(contentType);
    setSheetZone(zone);
    setSheetItemId(itemId);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetMode(null);
    setSheetContentType(null);
    setSheetZone(null);
    setSheetItemId(null);
  };

  const addContent = (cardType: string) => {
    openSheet({ mode: "add", contentType: cardType });
  };
  const editContent = (cardType: string, contentId: string) => {
    openSheet({ mode: "edit", contentType: cardType, itemId: contentId });
  };
  const deleteContent = (cardType: string, contentId: string) => {
    console.log(
      "deleteContent from context - Card Type:",
      cardType,
      "ID:",
      contentId
    );
  };
  const copyContent = (cardType: string, contentId: string) => {
    console.log(
      "copyContent from context - Card Type:",
      cardType,
      "ID:",
      contentId
    );
  };

  return (
    <AdminContext.Provider
      value={{
        addContent,
        editContent,
        deleteContent,
        copyContent,
        isSheetOpen,
        sheetMode,
        sheetContentType,
        sheetZone,
        sheetItemId,
        openSheet,
        closeSheet,
        refreshPages,
        setRefreshPages,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
