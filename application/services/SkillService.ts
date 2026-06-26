import Skill from "@/models/Skill";
import { BaseService, TableName } from "@/services/contracts/BaseService";

class SkillService extends BaseService<SkillService, Skill>() {
  getTable(): TableName {
    return "skills";
  }
}

export default SkillService;
