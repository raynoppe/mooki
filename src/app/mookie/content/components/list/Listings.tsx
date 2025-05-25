"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronRight,
  FileText,
  Film,
  Folder,
  MessageCircleHeart,
  Share2,
  Trash,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MookieListings = () => {
  const router = useRouter();
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-300 bg-gray-100">
            <TableHead>...</TableHead>
            <TableHead>Folder</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            className="hover:bg-gray-100 border-gray-300 cursor-pointer"
            onClick={() => router.push("/mookie/content/1")}
          >
            <TableCell>
              <Folder />
            </TableCell>
            <TableCell>The Best of Mookie</TableCell>
            <TableCell>/</TableCell>
            <TableCell>24th April 2025</TableCell>
            <TableCell>Published</TableCell>
            <TableCell className="flex justify-end text-gray-300">
              <ChevronRight />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default MookieListings;
