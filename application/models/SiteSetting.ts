import { Tables } from "@/integrations/supabase/database.types";
type SiteSettingBase = Omit<Tables<"site_settings">, "structure" | "value">;
interface StringStructure extends SiteSettingBase {
  structure: {
    type: "string";
  };
  value: string;
}

interface ArrayStructure extends SiteSettingBase {
  structure: {
    type: "array";
  };
  value: string[];
}

interface ParagraphStructure extends SiteSettingBase {
  structure: {
    type: "paragraph";
  };
  value: string;
}

type SiteSetting = ArrayStructure | ParagraphStructure | StringStructure;

export default SiteSetting;
