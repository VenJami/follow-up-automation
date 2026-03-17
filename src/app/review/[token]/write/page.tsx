import type { Metadata } from "next";
import { ReviewWriteClient } from "./review-write-client";

export const metadata: Metadata = {
  title: "Write a Review | Leslie Sullivan",
};

export default async function ReviewWritePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ReviewWriteClient token={token} />;
}

