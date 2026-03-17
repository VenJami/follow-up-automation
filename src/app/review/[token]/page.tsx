import type { Metadata } from "next";
import { ReviewInfoClient } from "./review-info-client";

export const metadata: Metadata = {
  title: "Leave a Review | Leslie Sullivan",
};

export default async function ReviewInfoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ReviewInfoClient token={token} />;
}

