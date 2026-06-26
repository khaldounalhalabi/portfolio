import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import SiteSetting from "@/models/SiteSetting";
import {
  BaseService,
  RECORD,
  TableName,
} from "@/services/contracts/BaseService";

class SiteSettingService extends BaseService<
  SiteSettingService,
  SiteSetting
>() {
  getTable(): TableName {
    return "site_settings";
  }

  public async getByKeys<K extends SiteSettingKeyEnum>(
    keys: K[],
  ): Promise<Extract<SiteSetting, { key: K }>[]> {
    const { data, error } = await this.supabase
      .from("site_settings")
      .select("*")
      .in("key", keys);

    if (error) {
      throw error;
    }

    return data as Extract<SiteSetting, { key: K }>[];
  }
}

export default SiteSettingService;
