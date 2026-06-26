import Project from "@/models/Project";
import { BaseService, TableName } from "@/services/contracts/BaseService";

class ProjectService extends BaseService<ProjectService, Project>() {
  getTable(): TableName {
    return "projects";
  }
}

export default ProjectService;
