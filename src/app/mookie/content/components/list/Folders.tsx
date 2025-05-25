"use client";
import { Tree, NodeRendererProps, TreeApi } from "react-arborist";
import {
  Folder as FolderIcon,
  ChevronRight,
  Edit2,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import {
  createFolderAction,
  renameFolderAction,
  deleteFolderAction,
  moveFolderAction,
} from "../../../actions/folderActions";
import FolderDialog from "./FolderDialog";
import { Input } from "@/components/ui/input";

// Define the structure of our folder data, matching Supabase table
export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_by_user_id?: string; // For auditing, not access control
  slug: string; // Added for URL usage
  order?: number;
  children?: Folder[]; // For react-arborist structure
  // We might add content later, so let's keep it extensible
  isRoot?: boolean;
}

const ROOT_FOLDER_NAME = "/";

// Changed component signature to accept initialData
interface MookieFoldersProps {
  initialData: Folder[];
}

const MookieFolders = ({ initialData }: MookieFoldersProps) => {
  const [data, setData] = useState<Folder[]>(initialData); // Initialize with prop
  const treeRef = useRef<TreeApi<Folder> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // State for the unified dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogParentId, setDialogParentId] = useState<string | null>(null);
  const [editingFolderData, setEditingFolderData] = useState<Folder | null>(
    null
  );

  const openDialog = (
    mode: "create" | "edit",
    parentId: string | null = null,
    folderToEdit: Folder | null = null
  ) => {
    setDialogMode(mode);
    setDialogParentId(parentId);
    setEditingFolderData(folderToEdit);
    setDialogOpen(true);
  };

  const handleDialogSave = async ({
    name,
    slug,
    parentId,
    folderId,
  }: {
    name: string;
    slug: string;
    parentId: string | null;
    folderId?: string;
  }) => {
    setDialogOpen(false);

    if (dialogMode === "create") {
      const tempId = `temp-${Date.now()}`;
      const newFolderDataForOptimisticUpdate: Folder = {
        id: tempId,
        name,
        parent_id: parentId,
        slug,
        children: [],
        isRoot: false,
      };
      setData((prev) => {
        const addRecursively = (nodes: Folder[]): Folder[] => {
          if (parentId === null && !nodes.find((n) => n.id === tempId))
            return [...nodes, newFolderDataForOptimisticUpdate];
          return nodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                children: [
                  ...(node.children || []),
                  newFolderDataForOptimisticUpdate,
                ],
              };
            }
            if (node.children) {
              return { ...node, children: addRecursively(node.children) };
            }
            return node;
          });
        };
        if (parentId === null && prev.some((f) => f.id === tempId)) return prev;
        return addRecursively(prev);
      });

      const result = await createFolderAction(name, parentId, slug);

      if (result.error || !result.newFolder) {
        console.error("Error creating folder:", result.error);
        alert(
          "Failed to create folder: " + (result.error || "Unknown server error")
        );
        setData((prev) => {
          const removeRecursively = (nodes: Folder[]): Folder[] => {
            return nodes
              .filter((n) => n.id !== tempId)
              .map((n) => {
                if (n.children)
                  return { ...n, children: removeRecursively(n.children) };
                return n;
              });
          };
          return removeRecursively(prev);
        });
      } else {
        setData((prev) => {
          const updateRecursively = (nodes: Folder[]): Folder[] => {
            return nodes.map((node) => {
              if (node.id === tempId) {
                return result.newFolder!;
              }
              if (node.children?.some((child) => child.id === tempId)) {
                return {
                  ...node,
                  children: updateRecursively(node.children),
                };
              }
              return node;
            });
          };
          if (parentId === null) {
            return prev.map((n) => (n.id === tempId ? result.newFolder! : n));
          }
          return updateRecursively(prev);
        });
      }
    } else if (dialogMode === "edit" && folderId && editingFolderData) {
      const oldName = editingFolderData.name;
      const oldSlug = editingFolderData.slug;

      setData((prevData) => {
        const updateNodeData = (nodes: Folder[]): Folder[] => {
          return nodes.map((n) => {
            if (n.id === folderId) return { ...n, name, slug };
            if (n.children)
              return { ...n, children: updateNodeData(n.children) };
            return n;
          });
        };
        return updateNodeData(prevData);
      });

      const result = await renameFolderAction(folderId, name, slug);

      if (result.error) {
        console.error("Error renaming folder:", result.error);
        alert("Failed to rename folder: " + result.error);
        setData((prevData) => {
          const revertNodeData = (nodes: Folder[]): Folder[] => {
            return nodes.map((n) => {
              if (n.id === folderId)
                return { ...n, name: oldName, slug: oldSlug };
              if (n.children)
                return { ...n, children: revertNodeData(n.children) };
              return n;
            });
          };
          return revertNodeData(prevData);
        });
      }
    }
  };

  const handleDelete = async (node: Folder) => {
    if (node.isRoot || node.name === ROOT_FOLDER_NAME) {
      alert("The root folder cannot be deleted.");
      return;
    }
    if (node.children && node.children.length > 0) {
      alert("Cannot delete folder with subfolders. Please delete them first.");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${node.name}"?`)) return;

    const originalData = JSON.parse(JSON.stringify(data));
    setData((prevData) => {
      const removeNode = (nodes: Folder[]): Folder[] => {
        return nodes
          .filter((n) => n.id !== node.id)
          .map((n) => {
            if (n.children) return { ...n, children: removeNode(n.children) };
            return n;
          });
      };
      return removeNode(prevData);
    });

    const result = await deleteFolderAction(node.id);

    if (result.error) {
      console.error("Error deleting folder:", result.error);
      alert("Failed to delete folder: " + result.error);
      setData(originalData);
    } else {
      console.log(
        `Folder ${node.name} deleted successfully via server action.`
      );
    }
  };

  const handleMove = async ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    const isMovingRoot = data.some(
      (folder) => dragIds.includes(folder.id) && folder.isRoot
    );
    if (isMovingRoot) {
      alert("The root folder cannot be moved.");
      return;
    }

    console.log("Client: Move operation started", { dragIds, parentId, index });

    let errorOccurred = false;
    for (const nodeId of dragIds) {
      const result = await moveFolderAction(nodeId, parentId);
      if (result.error) {
        console.error(
          `Error moving folder ${nodeId} to parent ${parentId}:`,
          result.error
        );
        alert(
          `Failed to move folder ${data.find((f) => f.id === nodeId)?.name || nodeId}. Error: ${result.error}. Some items may not have moved correctly.`
        );
        errorOccurred = true;
        break;
      }
    }

    if (errorOccurred) {
      console.warn(
        "Move operation completed with errors. UI might be inconsistent until next full load without a revert mechanism here."
      );
    } else {
      console.log(
        "Client: Move operation successful for all items via server actions."
      );
    }
  };

  const Node = ({ node, style, dragHandle }: NodeRendererProps<Folder>) => {
    const isActualRoot = node.data.isRoot;

    return (
      <div
        style={style}
        className={`flex items-center pr-2 group ${isActualRoot ? "bg-gray-50" : ""} ${node.state.isSelected && !isActualRoot ? "bg-blue-100" : ""}`}
        ref={dragHandle}
        onClick={() => {
          if (!isActualRoot && node.isInternal) node.toggle();
        }}
      >
        {[...Array(node.level)].map((_, i) => (
          <span key={i} className="w-4 inline-block"></span>
        ))}
        {node.isLeaf || !node.children || node.children.length === 0 ? (
          <FolderIcon className="w-5 h-5 mr-2 text-gray-600" />
        ) : (
          <ChevronRight
            className={`w-5 h-5 mr-2 text-gray-600 transition-transform ${
              node.isOpen ? "rotate-90" : ""
            } ${isActualRoot ? "invisible" : ""}`}
          />
        )}
        <span
          className="flex-grow truncate"
          onDoubleClick={() => {
            if (!isActualRoot) {
              openDialog("edit", node.data.parent_id, node.data);
            }
          }}
        >
          {node.data.name}
        </span>
        <div
          className={`ml-auto flex items-center transition-opacity ${
            isActualRoot ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {!isActualRoot && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog("create", node.data.id);
                }}
                title="Add subfolder"
                className="p-1 hover:bg-gray-200 rounded"
              >
                <PlusCircle size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDialog("edit", node.data.parent_id, node.data);
                }}
                title="Rename"
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isActualRoot) handleDelete(node.data);
                }}
                title="Delete"
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          {isActualRoot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDialog("create", node.data.id);
              }}
              title="Add subfolder to root"
              className="p-1 hover:bg-gray-200 rounded"
            >
              <PlusCircle size={16} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Open content for:", node.data.name);
            }}
            title="Open content"
            className="p-1 hover:bg-gray-200 rounded"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <Input
        type="text"
        placeholder="Filter folders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
      />
      <div className="border rounded-md">
        <Tree<Folder>
          ref={treeRef}
          data={data}
          width={500}
          height={600}
          rowHeight={32}
          searchTerm={searchTerm}
          disableDrag={(node: Folder) => node?.isRoot === true}
          onCreate={() => null}
          onRename={() => {
            console.log("Tree onRename called, handled by dialog.");
          }}
          onDelete={() => {
            console.log("Tree onDelete triggered, handled by custom buttons.");
          }}
          onMove={handleMove}
        >
          {(props) => Node(props)}
        </Tree>
      </div>
      <FolderDialog
        open={dialogOpen}
        mode={dialogMode}
        parentId={dialogParentId}
        initialFolderData={editingFolderData}
        onOpenChange={setDialogOpen}
        onSave={handleDialogSave}
      />
    </div>
  );
};

export default MookieFolders;
