import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Folder } from "./Folders"; // Assuming Folder type is in Folders.tsx

// Client-side slug generator (same as in folderActions)
function generateSlug(name: string): string {
  if (!name) return "untitled-folder";
  if (name === "/") return "root";
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface FolderDialogProps {
  open: boolean;
  mode: "create" | "edit";
  parentId: string | null; // For create mode
  initialFolderData?: Folder | null; // For edit mode
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    slug: string;
    parentId: string | null;
    folderId?: string;
  }) => void;
}

export default function FolderDialog({
  open,
  mode,
  parentId,
  initialFolderData,
  onOpenChange,
  onSave,
}: FolderDialogProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialFolderData) {
      setName(initialFolderData.name);
      setSlug(initialFolderData.slug);
      setSlugEdited(true); // When editing, assume slug might be custom
    } else {
      // Reset for create mode or if initial data is not available for edit
      setName("");
      setSlug("");
      setSlugEdited(false);
    }
  }, [open, mode, initialFolderData]);

  useEffect(() => {
    // Auto-generate slug only if not in edit mode or if name changes and slug wasn't manually edited
    if (mode === "create" && !slugEdited) {
      setSlug(generateSlug(name));
    } else if (
      mode === "edit" &&
      initialFolderData &&
      name !== initialFolderData.name &&
      !slugEdited
    ) {
      setSlug(generateSlug(name));
    }
  }, [name, slugEdited, mode, initialFolderData]);

  useEffect(() => {
    // Reset form state when dialog closes
    if (!open) {
      setName("");
      setSlug("");
      setSlugEdited(false);
    }
  }, [open]);

  const dialogTitle = mode === "edit" ? "Edit Folder" : "Create New Folder";
  const buttonText = mode === "edit" ? "Save Changes" : "Create Folder";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter a folder name. The slug is auto-generated but can be edited."
              : "Edit the folder name and slug."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onSave({
              name: name.trim(),
              slug: slug.trim(),
              parentId:
                mode === "create"
                  ? parentId
                  : (initialFolderData?.parent_id ?? null),
              folderId: mode === "edit" ? initialFolderData?.id : undefined,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Folder Name
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // If name changes, allow slug to auto-update unless it was already manually edited
                if (
                  slugEdited &&
                  mode === "edit" &&
                  initialFolderData &&
                  e.target.value === initialFolderData.name
                ) {
                  // if name reverts to original, and slug was edited, keep it edited.
                } else {
                  setSlugEdited(false);
                }
              }}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="Auto-generated slug"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || !slug.trim()}>
              {buttonText}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
