import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
