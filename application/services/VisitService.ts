import Visit from "@/models/Visit";
import { BaseService, TableName } from "@/services/contracts/BaseService";

class VisitService extends BaseService<VisitService, Visit>() {
  getTable(): TableName {
    return "visits";
  }
}

export default VisitService;
