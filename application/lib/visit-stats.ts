import { createClient } from "@/lib/supabase/server";

export interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  visitsThisWeek: number;
  visitsLastWeek: number;
  topPage: {
    path: string;
    count: number;
    percentage: number;
  } | null;
}

export async function getVisitStats(): Promise<VisitStats> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_visit_stats").single();

  if (error || !data) {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      visitsThisWeek: 0,
      visitsLastWeek: 0,
      topPage: null,
    };
  }

  return {
    totalVisits: data.total_visits,
    uniqueVisitors: data.unique_visitors,
    visitsThisWeek: data.visits_this_week,
    visitsLastWeek: data.visits_last_week,
    topPage: data.top_page_path
      ? {
          path: data.top_page_path,
          count: data.top_page_count,
          percentage: data.top_page_percentage,
        }
      : null,
  };
}
