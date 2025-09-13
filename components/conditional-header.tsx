"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dash";

  // Don't show the regular header on dashboard pages since they have their own authenticated header
  if (isDashboard) {
    return null;
  }

  return <Header />;
}