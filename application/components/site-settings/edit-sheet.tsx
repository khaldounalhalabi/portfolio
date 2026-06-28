"use client";

import Form from "@/components/forms/form";
import FormInput from "@/components/forms/form-input";
import FormTagsInput from "@/components/forms/form-tags-input";
import FormTiptap from "@/components/forms/form-tiptap";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SiteSetting from "@/models/SiteSetting";
import SiteSettingService from "@/services/SiteSettingService";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { title } from "@/lib/utils";

function getSchema(setting: SiteSetting) {
  switch (setting.structure.type) {
    case "string":
      return z.object({
        value: z.string().nonempty().min(1, "Value is required"),
      });
    case "array":
      return z.object({
        value: z
          .array(z.string().nonempty())
          .min(1, "At least one item is required")
          .nonoptional(),
      });
    case "paragraph":
      return z.object({
        value: z.string().nonempty().min(1, "Value is required"),
      });
    default:
      throw new Error("Unhandled Setting Type");
  }
}

const SettingField = ({ setting }: { setting: SiteSetting }) => {
  switch (setting.structure.type) {
    case "string":
      return <FormInput name="value" label="Value" />;
    case "array":
      return <FormTagsInput name="value" label="Value" />;
    case "paragraph":
      return <FormTiptap name="value" label="Value" minHeight="300px" />;
  }
};

const EditSheet = ({ setting }: { setting: SiteSetting }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon">
          <PencilIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit: {title(setting.key)}</SheetTitle>
        </SheetHeader>
        <div className={"m-3"}>
          <Form
            validation={getSchema(setting)}
            defaultValues={{
              value: setting.value as (string | undefined)[] | undefined,
            }}
            onSubmit={async (data) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await SiteSettingService.make().update(setting.id, {
                value: data.value,
              } as any);
            }}
            onSuccess={() => {
              toast.success("Setting updated");
              setOpen(false);
              router.refresh();
            }}
            withBackButton={false}
          >
            <SettingField setting={setting} />
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditSheet;
