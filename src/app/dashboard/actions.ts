"use server";

import { revalidatePath } from "next/cache";
import { getUserOrRedirect } from "@/lib/auth";
import { approveFollowup, dismissFollowup, moveToCategory } from "@/lib/followups";
import type { FollowupCategory } from "@/types/followup";

export async function approveFollowupAction(formData: FormData) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  await approveFollowup(id);
  revalidatePath("/dashboard");
}

export async function dismissFollowupAction(formData: FormData) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  await dismissFollowup(id);
  revalidatePath("/dashboard");
}

export async function moveToCategoryAction(formData: FormData) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();

  const id = formData.get("id");
  const category = formData.get("category");

  if (typeof id !== "string" || typeof category !== "string") return;

  await moveToCategory(id, category as FollowupCategory);
  revalidatePath("/dashboard");
}
