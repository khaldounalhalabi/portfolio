"use client";

import { QueryClient } from "@tanstack/query-core";

import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

const QueryClientProvider = ({ children }: { children?: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
};

export default QueryClientProvider;
