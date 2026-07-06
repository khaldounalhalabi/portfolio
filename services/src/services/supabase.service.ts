import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { config } from "../config.js";
import type { Database } from "../types/database.types.js";

export class SupabaseService {
  private static instance?: SupabaseService;

  public readonly client: SupabaseClient<Database>;

  private constructor() {
    this.client = createClient<Database>(
      config.supabaseUrl,
      config.supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  public static make(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }

    return SupabaseService.instance;
  }
}
