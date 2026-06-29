"use client";

import { useState } from "react";

import { regenerateResumeAction } from "@/app/(dashboard)/dashboard/resume/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileTextIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function RegenerateResumeCard() {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const result = await regenerateResumeAction();
    setIsRegenerating(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Resume regenerated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Resume
        </CardTitle>
        <CardDescription>
          Regenerate your ATS-friendly resume PDF from the latest portfolio
          content.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-fit"
        >
          {isRegenerating && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isRegenerating ? "Regenerating..." : "Regenerate Resume"}
        </Button>
        <p className="text-sm text-muted-foreground">
          The resume is also regenerated automatically during deployments.
        </p>
      </CardContent>
    </Card>
  );
}
