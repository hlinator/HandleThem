import { notFound } from "next/navigation";
import { GAMES, GAME_ORDER, isGameId } from "@/lib/games/meta";
import { FreePlay } from "@/components/app/FreePlay";

export function generateStaticParams() {
  return GAME_ORDER.map((hra) => ({ hra }));
}

export async function generateMetadata({ params }: { params: Promise<{ hra: string }> }) {
  const { hra } = await params;
  return { title: isGameId(hra) ? GAMES[hra].name : "Minihra" };
}

export default async function Page({ params }: { params: Promise<{ hra: string }> }) {
  const { hra } = await params;
  if (!isGameId(hra)) notFound();
  return <FreePlay game={hra} />;
}
