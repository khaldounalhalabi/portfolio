import SkillCategory from "@/models/SkillCategory";
import { BaseService, TableName } from "@/services/contracts/BaseService";

class SkillCategoryService extends BaseService<
  SkillCategoryService,
  SkillCategory
>() {
  getTable(): TableName {
    return "skill_categories";
  }
}

export default SkillCategoryService;
