import {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/integrations/supabase/database.types";
import { supabase } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import type {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";

export type TableName = keyof Database["public"]["Tables"];
type TableRecord = Tables<TableName>;

export type RECORD<MODEL extends TableName | TableRecord> = MODEL extends TableName
  ? Tables<MODEL>
  : MODEL;

export type RecordWithRelations<
  MODEL extends TableName | TableRecord,
  RELATIONS extends readonly TableName[] | undefined = undefined,
> = MODEL extends TableName ? WithRelations<MODEL, RELATIONS> : TableRecord;

type TableNameFromRecord<MODEL extends TableRecord> = {
  [K in TableName]: MODEL extends Tables<K> ? K : never;
}[TableName];

export type Insert<MODEL extends TableName | TableRecord> = MODEL extends TableName
  ? TablesInsert<MODEL>
  : MODEL extends TableRecord
    ? TablesInsert<TableNameFromRecord<MODEL>>
    : never;

export type Update<MODEL extends TableName | TableRecord> = MODEL extends TableName
  ? TablesUpdate<MODEL>
  : Partial<MODEL>;

export type PaginationResult<MODEL extends TableName | TableRecord> = {
  current_page: number;
  data: RECORD<MODEL>[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  total_pages: number;
};

/**
 * Helper type to get the relationship type (one-to-one or one-to-many) for a given relation
 * Checks the RELATION table's Relationships array to determine if it's one-to-one with MODEL
 */
type GetRelationType<
  MODEL extends TableName,
  RELATION extends TableName,
> = Database["public"]["Tables"][RELATION] extends {
  Relationships: Array<infer Rel>;
}
  ? Rel extends {
      referencedRelation: MODEL;
      isOneToOne: true;
    }
    ? Tables<RELATION> | null // One-to-one: single object or null
    : Tables<RELATION>[] // One-to-many: array
  : Tables<RELATION>[]; // Default to array if relationship not found

/**
 * Type helper to add relation keys to a table type
 * When relations are provided, adds them as keys with their corresponding table types
 * One-to-one relationships return a single object (or null), one-to-many return arrays
 */
type WithRelations<
  MODEL extends TableName,
  RELATIONS extends readonly TableName[] | undefined,
> = RELATIONS extends readonly TableName[]
  ? RELATIONS extends readonly []
    ? Tables<MODEL>
    : Tables<MODEL> & {
        [K in RELATIONS[number]]?: GetRelationType<MODEL, K> | null;
      }
  : Tables<MODEL>;

export function BaseService<SERVICE, MODEL extends TableName | TableRecord>() {
  return class BaseSupabaseService {
    protected static instance?: SERVICE;
    protected supabase: SupabaseClient;

    public table: TableName;

    protected constructor() {
      this.table = this.getTable();
      this.supabase = supabase;
    }

    public static make(): SERVICE {
      if (!this.instance) {
        // @ts-expect-error is necessary here
        this.instance = new this();
      }

      // @ts-expect-error is necessary here
      this.instance.table = this.instance.getTable();
      return this.instance as SERVICE;
    }

    public getTable(): TableName {
      throw new Error(
        "You need to define a getTable method within your service which determines which table is your service dealing with",
      );
    }

    public async server() {
      this.supabase = await createClient();
      return this;
    }

    public async all(): Promise<RECORD<MODEL>[]> {
      const { data, error } = (await this.supabase
        .from(this.table)
        .select("*")) as PostgrestResponse<RECORD<MODEL>>;

      if (error) {
        throw error;
      }

      return data as RECORD<MODEL>[];
    }

    protected async paginateQuery(
      query: ReturnType<typeof supabase.from>,
      page: number = 1,
      per_page: number = 10,
    ): Promise<PaginationResult<MODEL>> {
      const currentPageRequested = Math.max(1, page);
      const perPage = Math.max(1, per_page);

      const q = query;

      const fromIndex = (currentPageRequested - 1) * perPage;
      const toIndex = fromIndex + perPage - 1;

      const { data, error, count } = (await q.range(fromIndex, toIndex)) as
        | (PostgrestResponse<RECORD<MODEL>> & { count: number | null })
        | { data: null; error: unknown; count: number | null };

      if (error) throw error;

      const total = count ?? 0;
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      const currentPage = Math.min(currentPageRequested, lastPage);
      const totalPages = Math.max(1, Math.ceil(total / perPage));

      const rows = data ?? [];

      return {
        current_page: currentPage,
        data: rows,
        from: rows.length ? fromIndex + 1 : 1,
        to: rows.length ? fromIndex + rows.length : 1,
        last_page: lastPage,
        per_page: perPage,
        total,
        total_pages: totalPages,
      };
    }

    public async indexWithPagination<K extends keyof TableRecord>(
      page: number = 0,
      per_page: number = 10,
      options?: {
        sortCol?: K & string;
        sortDir?: "asc" | "desc";
        filters?: Record<K, TableRecord[K]>;
      },
    ): Promise<PaginationResult<MODEL>> {
      let query = supabase.from(this.table).select("*", { count: "exact" });

      const filters = Object.fromEntries(
        Object.entries(options?.filters ?? {}).filter(
          ([_key, value]) =>
            value !== undefined && value !== null && value !== "",
        ),
      );

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          // @ts-expect-error dynamic key
          query = query.eq(key, value);
        }
      }

      if (options?.sortCol) {
        query = query.order(options.sortCol, {
          ascending: options.sortDir !== "desc",
        });
      }

      return this.paginateQuery(query, page, per_page);
    }

    public async store(data: Insert<MODEL>): Promise<RECORD<MODEL>> {
      const { data: item, error } = (await this.supabase
        .from(this.table)
        .insert(data)
        .select()
        .single()) as PostgrestSingleResponse<RECORD<MODEL>>;

      if (error) {
        throw error;
      }

      return item;
    }

    public async update<D extends keyof RECORD<MODEL>>(
      id: RECORD<MODEL>[D],
      data: Update<MODEL>,
      idColumn: D = "id" as D,
    ): Promise<RECORD<MODEL> | null> {
      const { data: item } = (await this.supabase
        .from(this.table)
        .update(data)
        .eq(String(idColumn), id as unknown as object)
        .select()
        .single()) as PostgrestSingleResponse<RECORD<MODEL>>;

      return item;
    }

    public async delete<D extends keyof RECORD<MODEL>>(
      id: RECORD<MODEL>[D],
      idColumn: D = "id" as D,
    ) {
      const { error } = await this.supabase
        .from(this.table)
        .delete()
        .eq(idColumn as string, id as unknown as object);

      return !error;
    }

    public async show<
      D extends keyof RECORD<MODEL>,
      RELATIONS extends readonly TableName[] | undefined = undefined,
    >(
      id: RECORD<MODEL>[D],
      relations?: RELATIONS,
      idColumn: D = "id" as D,
    ): Promise<RecordWithRelations<MODEL, RELATIONS> | null> {
      const relationsArray = (relations ?? []) as TableName[];
      const relationString = this.getRelationString(relationsArray);
      const { data, error } = (await this.supabase
        .from(this.table)
        .select(relationString.length > 0 ? `*, ${relationString}` : "*")
        .eq(String(idColumn), id as unknown as object)
        .single()) as PostgrestSingleResponse<
        RecordWithRelations<MODEL, RELATIONS>
      >;

      if (error) {
        throw error;
      }

      return data;
    }

    protected getRelationString(relations: readonly TableName[]) {
      return relations?.map((r) => `${r}(*)`)?.join(", ") ?? "";
    }
  };
}
