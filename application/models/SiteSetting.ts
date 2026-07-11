import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { Tables } from "@/integrations/supabase/database.types";
type SiteSettingBase = Omit<Tables<"site_settings">, "structure" | "value">;
interface StringStructure<
  K extends SiteSettingKeyEnum,
> extends SiteSettingBase {
  key: K;
  structure: { type: "string" };
  value: string;
}

interface ArrayStructure<K extends SiteSettingKeyEnum> extends SiteSettingBase {
  structure: {
    type: "array";
  };
  value: string[];
  key: K;
}

interface ParagraphStructure<
  K extends SiteSettingKeyEnum,
> extends SiteSettingBase {
  structure: {
    type: "paragraph";
  };
  value: string;
  key: K;
}

type SiteSetting =
  // Array Structure
  | ArrayStructure<SiteSettingKeyEnum.HERO_SKILLS>
  // Paragraph Structure
  | ParagraphStructure<SiteSettingKeyEnum.HERO_PARAGRAPH>
  // String Structure
  | StringStructure<SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME>
  | StringStructure<SiteSettingKeyEnum.EMAIL>
  | StringStructure<SiteSettingKeyEnum.PHONE>
  | StringStructure<SiteSettingKeyEnum.LOCATION>
  | StringStructure<SiteSettingKeyEnum.LINKED_IN>
  | StringStructure<SiteSettingKeyEnum.GITHUB>
  | StringStructure<SiteSettingKeyEnum.GITLAB>
  | StringStructure<SiteSettingKeyEnum.WHATSAPP>
  | StringStructure<SiteSettingKeyEnum.TELEGRAM>
  | StringStructure<SiteSettingKeyEnum.PRE_FILLED_MESSAGE>
  | StringStructure<SiteSettingKeyEnum.STACKOVERFLOW>
  | StringStructure<SiteSettingKeyEnum.RESUME_LINK>;

export default SiteSetting;
