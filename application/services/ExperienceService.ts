import Experience from "@/models/Experience";
import {
  BaseService,
  RECORD,
  TableName,
} from "@/services/contracts/BaseService";
import type { PostgrestResponse } from "@supabase/supabase-js";

class ExperienceService extends BaseService<ExperienceService, Experience>() {
  getTable(): TableName {
    return "experiences";
  }

  async all(): Promise<RECORD<Experience>[]> {
    const { data, error } = (await this.supabase
      .from("experiences")
      .select("*")
      .order("from", { ascending: false })) as PostgrestResponse<
      RECORD<Experience>
    >;

    if (error) {
      throw error;
    }

    return data;
  }
}

export default ExperienceService;
