import { SiteLayout } from "@/components/portfolio/site-layout";
import SiteSettingsProvider from "@/components/providers/site-settings-provider";
import SiteSettingService from "@/services/SiteSettingService";
import { ReactNode } from "react";

export default async function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await SiteSettingService.make().all();

  return (
    <SiteSettingsProvider siteSettings={siteSettings}>
      <SiteLayout>{children}</SiteLayout>
    </SiteSettingsProvider>
  );
}
