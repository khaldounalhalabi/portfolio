import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { Tables } from "@/integrations/supabase/database.types";
type SiteSettingBase = Omit<Tables<"site_settings">, "structure" | "value">;
interface StringStructure extends SiteSettingBase {
  structure: {
    type: "string";
  };
  value: string;
  key: SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME;
}

interface ArrayStructure extends SiteSettingBase {
  structure: {
    type: "array";
  };
  value: string[];
  key: SiteSettingKeyEnum.HERO_SKILLS;
}

interface ParagraphStructure extends SiteSettingBase {
  structure: {
    type: "paragraph";
  };
  value: string;
  key: SiteSettingKeyEnum.HERO_PARAGRAPH;
}

type SiteSetting = ArrayStructure | ParagraphStructure | StringStructure;

export default SiteSetting;
