import { notFound } from "next/navigation";
import { NODES, nodeById } from "@/lib/path/data";
import { LessonPlayer } from "@/components/app/LessonPlayer";

export function generateStaticParams() {
  return NODES.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: nodeById(id)?.title ?? "Lekce" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const node = nodeById(id);
  if (!node) notFound();
  return <LessonPlayer nodeId={node.id} />;
}
