import { SiteLayout } from "@/components/portfolio/site-layout";
import SiteSettingsProvider from "@/components/providers/site-settings-provider";
import { VisitTracker } from "@/components/visit-tracker";
import { createClient } from "@/lib/supabase/server";
import SiteSettingService from "@/services/SiteSettingService";
import { ReactNode } from "react";

export default async function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const siteSettings = await SiteSettingService.make()
    .setClient(supabase)
    .all();

  return (
    <SiteSettingsProvider siteSettings={siteSettings}>
      <SiteLayout>
        {children}
        <VisitTracker />
      </SiteLayout>
    </SiteSettingsProvider>
  );
}
