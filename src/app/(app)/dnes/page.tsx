import type { Metadata } from "next";
import { TodayView } from "@/components/app/TodayView";

export const metadata: Metadata = { title: "Dnes" };

export default function Page() {
  return <TodayView />;
}
