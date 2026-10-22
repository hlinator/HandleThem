import type { Metadata } from "next";
import { TrainingList } from "@/components/app/TrainingList";

export const metadata: Metadata = { title: "Volný trénink" };

export default function Page() {
  return <TrainingList />;
}
