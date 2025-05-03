import {
  BookOpenText,
  FolderTree,
  LayoutDashboard,
  Newspaper,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const AdminNavi = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/mookie" className="text-2xl font-bold">
              <LayoutDashboard />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="ml-1 bg-black text-white" side="right">
            <p>Dashboard</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/mookie/pages" className="text-2xl font-bold">
              <BookOpenText />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="ml-1 bg-black text-white" side="right">
            <p>Pages</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/mookie/navigation" className="text-2xl font-bold">
              <FolderTree />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="ml-1 bg-black text-white" side="right">
            <p>Navigation</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/mookie/articles" className="text-2xl font-bold">
              <Newspaper />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="ml-1 bg-black text-white" side="right">
            <p>Aritcles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AdminNavi;
