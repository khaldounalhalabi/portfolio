import { getPortfolioData } from "@/lib/portfolio/queries";
import { SiteLayout } from "@/components/portfolio/site-layout";

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { contactInfo, contactLinks } = await getPortfolioData();

  return (
    <SiteLayout contactInfo={contactInfo} contactLinks={contactLinks}>
      {children}
    </SiteLayout>
  );
}
