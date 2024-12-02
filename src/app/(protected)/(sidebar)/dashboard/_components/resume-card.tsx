"use client";

import { timeAgo } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import {
  MoreVertical,
  Edit,
  Trash,
  Printer,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResumeCardsProps {
  resumes: {
    id: string;
    name: string;
    thumbnail: string;
    createdAt: Date;
  }[];
}

export const ResumeCards = ({ resumes }: ResumeCardsProps) => {
  return (
    <div className="flex gap-4">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} {...resume} />
      ))}
    </div>
  );
};

interface ResumeCardProps {
  id: string;
  thumbnail: string;
  createdAt: Date;
  name: string;
}

function ResumeCard({ id, thumbnail, createdAt, name }: ResumeCardProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleEdit = () => console.log("Edit resume", id);
  const handleDelete = () => console.log("Delete resume", id);
  const handlePrint = () => console.log("Print resume", id);
  const handleRename = () => console.log("Rename resume", id);

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg border bg-white hover:bg-muted"
      onClick={() => setIsOptionsOpen(!isOptionsOpen)}
    >
      <div className="relative">
        <Image
          src={thumbnail}
          unoptimized
          width={300}
          height={400}
          alt={`${name} resume thumbnail`}
          className="h-[190px] w-[170px] object-cover object-top"
        />

        <div className="absolute right-2 top-2">
          <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                <span>Print</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRename}>
                <FileSignature className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-2">
        <h3 className="text-md mb-1 truncate">{name}</h3>
        <p className="text-sm text-gray-500">Edited {timeAgo(createdAt)}</p>
      </div>
    </div>
  );
}
