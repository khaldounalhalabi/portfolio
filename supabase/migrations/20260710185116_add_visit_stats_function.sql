create or replace function get_visit_stats()
returns table (
  total_visits bigint,
  unique_visitors bigint,
  visits_this_week bigint,
  visits_last_week bigint,
  top_page_path text,
  top_page_count bigint,
  top_page_percentage numeric
)
language sql
security invoker
as $$
  with
    total as (
      select count(*) as count from visits
    ),
    unique_sessions as (
      select count(distinct session_id) as count from visits
    ),
    this_week as (
      select count(*) as count from visits
      where created_at >= now() - interval '7 days'
    ),
    last_week as (
      select count(*) as count from visits
      where created_at >= now() - interval '14 days'
        and created_at < now() - interval '7 days'
    ),
    top_page as (
      select path, count(*) as count
      from visits
      group by path
      order by count desc
      limit 1
    )
  select
    total.count as total_visits,
    unique_sessions.count as unique_visitors,
    this_week.count as visits_this_week,
    last_week.count as visits_last_week,
    top_page.path as top_page_path,
    top_page.count as top_page_count,
    case
      when total.count > 0 and top_page.count is not null
        then round((top_page.count::numeric / total.count::numeric) * 100, 1)
      else 0
    end as top_page_percentage
  from total
  cross join unique_sessions
  cross join this_week
  cross join last_week
  left join lateral (select * from top_page) as top_page on true;
$$;

revoke execute on function get_visit_stats() from public;
grant execute on function get_visit_stats() to authenticated;
