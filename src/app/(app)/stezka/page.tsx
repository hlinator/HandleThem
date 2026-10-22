import type { Metadata } from "next";
import { PathView } from "@/components/app/PathView";

export const metadata: Metadata = { title: "Stezka" };

export default function Page() {
  return <PathView />;
}
