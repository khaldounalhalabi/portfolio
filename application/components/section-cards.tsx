import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getVisitStats } from "@/lib/visit-stats";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function formatTrend(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "New" : "0%";
  }

  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

function formatPageLabel(path: string): string {
  if (path === "/") return "Home";
  if (path === "/projects") return "Projects";
  if (path === "/experience") return "Experience";
  if (path === "/contact") return "Contact";

  const projectMatch = path.match(/^\/projects\/(.+)$/);
  if (projectMatch) {
    return `Project / ${projectMatch[1]}`;
  }

  return path;
}

export async function SectionCards() {
  const stats = await getVisitStats();

  const totalTrend = formatTrend(
    stats.visitsThisWeek,
    stats.visitsLastWeek,
  );
  const uniqueTrend = formatTrend(
    stats.visitsThisWeek,
    stats.visitsLastWeek,
  );
  const weeklyTrend = formatTrend(
    stats.visitsThisWeek,
    stats.visitsLastWeek,
  );

  const cards = [
    {
      label: "Total Visits",
      value: formatNumber(stats.totalVisits),
      trend: totalTrend,
      footer: "All-time portfolio page views",
      meta: "Cumulative portfolio traffic",
      isNumeric: true,
    },
    {
      label: "Unique Visitors",
      value: formatNumber(stats.uniqueVisitors),
      trend: uniqueTrend,
      footer: "Distinct visitor sessions",
      meta: "Tracked across portfolio pages",
      isNumeric: true,
    },
    {
      label: "Visits This Week",
      value: formatNumber(stats.visitsThisWeek),
      trend: weeklyTrend,
      footer: "Last 7 days vs previous week",
      meta: "Recent portfolio activity",
      isNumeric: true,
    },
    {
      label: "Top Page",
      value: stats.topPage ? formatPageLabel(stats.topPage.path) : "—",
      trend: stats.topPage ? `${stats.topPage.percentage}%` : "0%",
      footer: stats.topPage
        ? `${formatNumber(stats.topPage.count)} views`
        : "No visits recorded yet",
      meta: "Most visited portfolio page",
      isNumeric: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card) => {
        const isPositive =
          card.trend !== "0%" &&
          card.trend !== "New" &&
          !card.trend.startsWith("-");
        const isNegative = card.trend.startsWith("-");

        return (
          <Card key={card.label} className="@container/card">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle
                className={`text-2xl font-semibold @[250px]/card:text-3xl ${
                  card.isNumeric
                    ? "tabular-nums"
                    : "line-clamp-2 break-words text-xl @[250px]/card:text-2xl"
                }`}
              >
                {card.value}
              </CardTitle>
              <CardAction>
                <Badge
                  variant="outline"
                  className={
                    isNegative
                      ? "border-red-500/20 text-red-500"
                      : isPositive
                        ? "border-emerald-500/20 text-emerald-500"
                        : "text-muted-foreground"
                  }
                >
                  {isNegative ? (
                    <TrendingDownIcon className="size-3.5" />
                  ) : isPositive ? (
                    <TrendingUpIcon className="size-3.5" />
                  ) : null}
                  {card.trend}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.footer}
              </div>
              <div className="text-muted-foreground">{card.meta}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
