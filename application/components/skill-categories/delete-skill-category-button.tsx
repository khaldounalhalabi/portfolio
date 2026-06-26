"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import SkillCategory from "@/models/SkillCategory";
import SkillCategoryService from "@/services/SkillCategoryService";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteSkillCategoryButton = ({
  category,
}: {
  category: SkillCategory;
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {category.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={async (event) => {
              event.preventDefault();
              setIsDeleting(true);
              const deleted = await SkillCategoryService.make().delete(
                category.id,
              );

              if (!deleted) {
                toast.error("Skill category could not be deleted");
                setIsDeleting(false);
                return;
              }

              toast.success("Skill category deleted");
              router.refresh();
              setIsDeleting(false);
              setOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSkillCategoryButton;
