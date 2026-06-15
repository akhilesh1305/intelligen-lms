import { redirect } from "next/navigation";

export default async function ChallengePlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const query = new URLSearchParams({
    quiz: id,
    tab: tab === "weekly" ? "weekly" : "daily",
  });
  redirect(`/challenges/play?${query.toString()}`);
}
