"use server";

import { createClient } from "@/utils/supabase/server";
import type { Folder } from "@/app/mookie/content/components/list/Folders"; // Path will be checked, slug to be added

const ROOT_FOLDER_NAME = "/";
const ROOT_FOLDER_SLUG = "root";

// --- Slug Generation Utility ---
export async function generateSlug(name: string): Promise<string> {
  if (!name) return "untitled-folder";
  if (name === ROOT_FOLDER_NAME) return ROOT_FOLDER_SLUG; // Ensure root gets "root" slug
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// --- Server Actions for Folders ---

/**
 * Fetches all folders, ensures the global root folder exists,
 * nests them, and returns the tree structure.
 */
export async function getInitialFoldersAndEnsureRootAction(): Promise<
  Folder[]
> {
  console.log("SA: getInitialFoldersAndEnsureRootAction called");
  const supabase = await createClient();

  try {
    // 1. Fetch all existing folders
    const { data: allFoldersRaw, error: fetchError } = await supabase
      .from("folders")
      .select("id, name, parent_id, order, created_by_user_id, slug")
      .order("order", { ascending: true, nullsFirst: true })
      .order("name", { ascending: true });

    if (fetchError) {
      console.error("SA: Error fetching folders:", fetchError);
      return []; // Return empty array on error
    }

    let foldersToProcess: Folder[] = allFoldersRaw || [];

    // 2. Check if root folder exists
    const rootExists = foldersToProcess.some(
      (f) => f.name === ROOT_FOLDER_NAME && f.parent_id === null
    );

    // 3. Create Root Folder if Missing
    if (!rootExists) {
      console.log("SA: Root folder not found, creating it.");
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "SA: Error fetching user for root folder creation or user not found:",
          userError
        );
        // Critical error: cannot create root without user context for created_by_user_id if policy requires it.
        // Depending on RLS, this might still succeed if created_by_user_id is nullable or has a default.
        // For now, we proceed but this is a potential failure point if RLS is strict.
        // Consider throwing an error or returning a more specific error state.
      }

      const newRootData = {
        name: ROOT_FOLDER_NAME,
        parent_id: null,
        slug: ROOT_FOLDER_SLUG, // Explicitly set root slug
        order: -1, // Ensure it appears first
        created_by_user_id: user?.id, // User ID can be null if not fetched
      };

      const { data: newRoot, error: insertRootError } = await supabase
        .from("folders")
        .insert(newRootData)
        .select("id, name, parent_id, order, created_by_user_id, slug")
        .single();

      if (insertRootError) {
        console.error("SA: Error inserting new root folder:", insertRootError);
        // Failed to create essential root folder, return empty or throw
        return [];
      }

      if (newRoot) {
        console.log("SA: Root folder created successfully.", newRoot);
        // Add the new root to the list of folders to be processed
        // Ensure it has all Folder properties for consistency before adding to foldersToProcess
        const completeNewRoot: Folder = {
          ...newRoot,
          children: [],
          isRoot: true,
        };
        foldersToProcess = [completeNewRoot, ...foldersToProcess];
      } else {
        console.error(
          "SA: New root folder data is null after insert, this should not happen."
        );
        return [];
      }
    }

    // 4. Nest folders
    const nest = (
      items: Folder[],
      currentParentId: string | null = null
    ): Folder[] =>
      items
        .filter((item) => item.parent_id === currentParentId)
        .map((item) => ({
          ...item,
          isRoot: item.name === ROOT_FOLDER_NAME && item.parent_id === null,
          children: nest(items, item.id),
        }));

    const nestedFolders = nest(foldersToProcess);

    return nestedFolders;
  } catch (error) {
    console.error(
      "SA: Unexpected error in getInitialFoldersAndEnsureRootAction:",
      error
    );
    return []; // Return empty array on unexpected errors
  }
}

/**
 * Creates a new folder.
 */
export async function createFolderAction(
  name: string,
  parentId: string | null,
  slugOverride?: string
): Promise<{ error?: string; newFolder?: Folder }> {
  console.log("SA: createFolderAction called with:", {
    name,
    parentId,
    slugOverride,
  });
  const supabase = await createClient();
  const slug = slugOverride ? slugOverride : await generateSlug(name);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        "SA: Error fetching user for folder creation or user not found:",
        userError
      );
      return { error: "User authentication failed. Cannot create folder." };
    }

    const newFolderData = {
      name,
      parent_id: parentId,
      slug,
      created_by_user_id: user.id,
      // 'order' can be omitted if there's a DB default or handled by a trigger.
      // Or set a default like 0 or handle ordering more explicitly later.
    };

    const { data: insertedFolder, error: insertError } = await supabase
      .from("folders")
      .insert(newFolderData)
      .select("id, name, parent_id, order, created_by_user_id, slug") // Ensure all Folder fields are selected
      .single();

    if (insertError) {
      console.error("SA: Error inserting new folder:", insertError);
      // Check for unique constraint violation (e.g., slug already exists for this parent or globally if unique)
      if (insertError.code === "23505") {
        // PostgreSQL unique violation code
        return {
          error: `Folder name or slug '${slug}' likely already exists. Please choose a different name.`,
        };
      }
      return { error: insertError.message || "Failed to create folder." };
    }

    if (!insertedFolder) {
      console.error(
        "SA: Inserted folder data is null after insert without error, this should not happen."
      );
      return { error: "Failed to create folder, server returned no data." };
    }

    // Ensure the returned folder conforms to the Folder interface, especially if children/isRoot are expected
    // For a newly created folder, children would be empty and isRoot would be false unless parentId is null (which is handled by root creation)
    const completeInsertedFolder: Folder = {
      ...insertedFolder,
      children: [],
      isRoot:
        insertedFolder.name === ROOT_FOLDER_NAME &&
        insertedFolder.parent_id === null,
    };

    return { newFolder: completeInsertedFolder };
  } catch (error: unknown) {
    console.error("SA: Unexpected error in createFolderAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

/**
 * Renames a folder.
 */
export async function renameFolderAction(
  folderId: string,
  newName: string,
  newSlug?: string
): Promise<{ error?: string }> {
  console.log("SA: renameFolderAction called with:", {
    folderId,
    newName,
    newSlug,
  });
  const supabase = await createClient();

  // Prevent renaming to root folder name or empty name (additional server-side check)
  if (!newName || newName.trim() === "" || newName === ROOT_FOLDER_NAME) {
    return {
      error: `Invalid folder name. Name cannot be empty or "${ROOT_FOLDER_NAME}".`,
    };
  }

  // It might be good to check if the folder being renamed is the root folder itself.
  // Fetch the folder first to check if it's the root.
  const { data: folderToRename, error: fetchFolderError } = await supabase
    .from("folders")
    .select("id, name, parent_id")
    .eq("id", folderId)
    .single();

  if (fetchFolderError) {
    console.error("SA: Error fetching folder before rename:", fetchFolderError);
    return { error: "Could not verify folder before renaming." };
  }

  if (!folderToRename) {
    return { error: "Folder not found." };
  }

  if (
    folderToRename.name === ROOT_FOLDER_NAME &&
    folderToRename.parent_id === null
  ) {
    return { error: "The root folder cannot be renamed." };
  }

  try {
    const updateData: { name: string; slug?: string } = { name: newName };
    if (newSlug) {
      updateData.slug = newSlug;
    }

    const { error: updateError } = await supabase
      .from("folders")
      .update(updateData)
      .eq("id", folderId);

    if (updateError) {
      console.error("SA: Error updating folder name/slug:", updateError);
      if (updateError.code === "23505") {
        // PostgreSQL unique violation code
        return {
          error: `Folder name or slug '${newSlug || newName}' likely already exists. Please choose a different name/slug.`,
        };
      }
      return { error: updateError.message || "Failed to rename folder." };
    }

    return {}; // Success
  } catch (error: unknown) {
    console.error("SA: Unexpected error in renameFolderAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during rename." };
  }
}

/**
 * Deletes a folder.
 */
export async function deleteFolderAction(
  folderId: string
): Promise<{ error?: string }> {
  console.log("SA: deleteFolderAction called with:", { folderId });
  const supabase = await createClient();

  try {
    // 1. Fetch the folder to check if it's the root or has children
    const { data: folderToDelete, error: fetchError } = await supabase
      .from("folders")
      .select("id, name, parent_id") // Only need basic info for checks
      .eq("id", folderId)
      .single();

    if (fetchError) {
      console.error("SA: Error fetching folder before delete:", fetchError);
      return { error: "Could not verify folder before deletion." };
    }
    if (!folderToDelete) {
      return { error: "Folder not found." };
    }

    // 2. Server-side check: Prevent deleting the root folder
    if (
      folderToDelete.name === ROOT_FOLDER_NAME &&
      folderToDelete.parent_id === null
    ) {
      return { error: "The root folder cannot be deleted." };
    }

    // 3. Server-side check: Prevent deleting folder with children
    const { count: childCount, error: childrenCountError } = await supabase
      .from("folders")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", folderId);

    if (childrenCountError) {
      console.error("SA: Error counting child folders:", childrenCountError);
      return { error: "Could not verify folder children before deletion." };
    }

    if (childCount && childCount > 0) {
      return {
        error:
          "Cannot delete folder with subfolders. Please delete them first.",
      };
    }

    // 4. Delete the folder
    const { error: deleteError } = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId);

    if (deleteError) {
      console.error("SA: Error deleting folder:", deleteError);
      return { error: deleteError.message || "Failed to delete folder." };
    }

    return {}; // Success
  } catch (error: unknown) {
    console.error("SA: Unexpected error in deleteFolderAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during deletion." };
  }
}

/**
 * Moves a folder (updates its parent_id and potentially order).
 */
export async function moveFolderAction(
  folderId: string,
  newParentId: string | null
  // order: number // Future: for explicit ordering
): Promise<{ error?: string }> {
  console.log("SA: moveFolderAction called with:", { folderId, newParentId });
  const supabase = await createClient();

  try {
    // 1. Basic Validation
    if (folderId === newParentId) {
      return { error: "Cannot move a folder into itself." };
    }

    // 2. Fetch the folder being moved to check if it's the root
    const { data: folderToMove, error: fetchError } = await supabase
      .from("folders")
      .select("id, name, parent_id")
      .eq("id", folderId)
      .single();

    if (fetchError) {
      console.error("SA: Error fetching folder before move:", fetchError);
      return { error: "Could not verify folder before moving." };
    }
    if (!folderToMove) {
      return { error: "Folder to move not found." };
    }

    if (
      folderToMove.name === ROOT_FOLDER_NAME &&
      folderToMove.parent_id === null
    ) {
      return { error: "The root folder cannot be moved." };
    }

    // 3. If newParentId is not null, verify it exists and is not the folder itself (already checked)
    //    and is not a child of the folder being moved (simple circular dependency check)
    if (newParentId !== null) {
      const { data: parentFolder, error: fetchParentError } = await supabase
        .from("folders")
        .select("id, parent_id")
        .eq("id", newParentId)
        .single();

      if (fetchParentError || !parentFolder) {
        return {
          error: "Target parent folder not found or error fetching it.",
        };
      }

      // Simple check: prevent moving a folder into its own direct child.
      // A full circular check would involve traversing up from newParentId.
      if (parentFolder.parent_id === folderId) {
        return { error: "Cannot move a folder into its own child folder." };
      }
    }

    // TODO: Add more robust circular dependency check if required.
    // This involves checking if newParentId is a descendant of folderId.

    // 4. Update parent_id
    const { error: updateError } = await supabase
      .from("folders")
      .update({ parent_id: newParentId })
      .eq("id", folderId);

    if (updateError) {
      console.error("SA: Error updating folder parent:", updateError);
      return { error: updateError.message || "Failed to move folder." };
    }

    // TODO: Implement order management if/when `index` is used.

    return {}; // Success
  } catch (error: unknown) {
    console.error("SA: Unexpected error in moveFolderAction:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during move." };
  }
}
