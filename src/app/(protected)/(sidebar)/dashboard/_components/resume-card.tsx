"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { ResumeSkeleton } from "./resume-skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResume, renameResume } from "@/actions/resume-mutation";
import { Input } from "@/components/ui/input";
import { ResponsiveModalDrawer } from "@/components/ui/responsive-modal";
import { toast } from "sonner";

interface ResumeCardsProps {
  resumes: {
    id: string;
    name: string | null;
    thumbnail: string | null;
    createdAt: Date;
  }[];
}

export const ResumeCards = ({ resumes: defaultResumes }: ResumeCardsProps) => {
  const {
    data: resumes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const response = await fetch("/api/user/resume");
      const data = (await response.json()) as {
        data: ResumeCardProps[];
        success: boolean;
        error: string;
      };
      console.log(data);

      if (data.success) {
        return data.data;
      }
      throw new Error(data.error);
    },
    initialData: defaultResumes,
  });

  if (isLoading) return <ResumeSkeleton />;
  if (isError) return <div>Error fetching resumes</div>;
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
  thumbnail: string | null;
  createdAt: Date;
  name: string | null;
}

function ResumeCard({ id, thumbnail, createdAt, name }: ResumeCardProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newName, setNewName] = useState(name ?? "");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async ({ resumeId }: { resumeId: string }) => {
      const toastId = toast.loading("Deleting resume...", {
        duration: Infinity,
      });
      await deleteResume({ resumeId });
      toast.dismiss(toastId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsDeleteModalOpen(false);
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({
      resumeId,
      name,
    }: {
      resumeId: string;
      name: string;
    }) => {
      const toastId = toast.loading("Renaming resume...", {
        duration: Infinity,
      });
      await renameResume({ resumeId, name });
      toast.dismiss(toastId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["resumes"] });
      setIsRenameModalOpen(false);
    },
  });

  const handleEdit = () => {
    router.push(`/resume/${id}/editor`);
  };

  const DeleteDialog = () => {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this resume?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate({ resumeId: id })}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    );
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handlePrint = () => console.log("Print resume", id);

  const handleRename = () => {
    setIsRenameModalOpen(true);
  };

  const handleCloseRename = () => {
    if (isRenameModalOpen && renameMutation.isPending) return;
    setIsRenameModalOpen(false);
  };

  const handleCloseDelete = () => {
    if (isDeleteModalOpen && deleteMutation.isPending) return;
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        className="relative cursor-pointer overflow-hidden rounded-lg border bg-white hover:bg-muted"
        onClick={() => setIsOptionsOpen(!isOptionsOpen)}
      >
        <div className="">
          <Image
            src={thumbnail ?? "/resume/resume1.png"}
            unoptimized
            width={300}
            height={400}
            alt={`${name} resume thumbnail`}
            className="h-[190px] w-[170px] object-cover object-top"
          />

          <div className="sr-only absolute bottom-2 right-2">
            <DropdownMenu open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  <span>Print</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRename}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t p-2">
          <h3 className="text-md mb-1 truncate">{name}</h3>
          <p className="text-sm text-gray-500">Edited {timeAgo(createdAt)}</p>
        </div>
      </div>

      <ResponsiveModalDrawer
        title="Delete Resume"
        open={isDeleteModalOpen}
        onOpenChange={handleCloseDelete}
      >
        <DeleteDialog />
      </ResponsiveModalDrawer>

      <ResponsiveModalDrawer
        title="Rename Resume"
        open={isRenameModalOpen}
        onOpenChange={handleCloseRename}
      >
        <div className="space-y-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter resume name"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                renameMutation.mutate({ resumeId: id, name: newName })
              }
              disabled={renameMutation.isPending || !newName.trim()}
            >
              {renameMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </ResponsiveModalDrawer>
    </>
  );
}

// Add this new component for the rename dialog
