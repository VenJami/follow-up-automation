import type { Metadata } from "next";
import { ReviewOptionsClient } from "./review-options-client";

export const metadata: Metadata = {
  title: "Review Options | Leslie Sullivan",
};

export default async function ReviewOptionsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ReviewOptionsClient token={token} />;
}

