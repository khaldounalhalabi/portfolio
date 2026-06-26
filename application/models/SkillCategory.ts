import { Tables } from "@/integrations/supabase/database.types";
import Skill from "@/models/Skill";

interface SkillCategory extends Tables<"skill_categories"> {
  skills?: Skill[];
}

export default SkillCategory;
