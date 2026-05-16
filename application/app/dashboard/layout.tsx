import { AppSidebar } from "@/components/app-sidebar";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthenticatedUser();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-3 border-b border-white/5 bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                  Admin Dashboard
                </p>
                <h1 className="font-heading text-lg font-semibold text-primary">
                  Portfolio Content
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-on-surface-variant md:inline">
                  {user.email}
                </span>
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="flex-1 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
