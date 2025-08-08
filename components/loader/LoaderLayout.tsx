"use client";

import { usePageLoader } from "../../hooks/usePageLoader";
import Loader from "./Loader";

export default function PageLoaderWrapper({ children }: { children: React.ReactNode }) {
  const loading = usePageLoader(3000);
  return loading ? <Loader /> : <>{children}</>;
}
