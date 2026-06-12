import SiteSetting from "@/models/SiteSetting";
import { BaseService, TableName } from "@/services/contracts/BaseService";

class SiteSettingService extends BaseService<
  SiteSettingService,
  SiteSetting
>() {
  getTable(): TableName {
    return "site_settings";
  }
}

export default SiteSettingService;
