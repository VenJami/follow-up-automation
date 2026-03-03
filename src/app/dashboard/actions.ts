"use server";

import { revalidatePath } from "next/cache";
import { getUserOrRedirect } from "@/lib/auth";
import {
  approveFollowup,
  dismissFollowup,
  moveToCategory,
  markFollowupRead,
  bulkApproveFollowups,
  bulkDismissFollowups,
  bulkMoveToCategory,
  bulkMarkReadState,
} from "@/lib/followups";
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

export async function markFollowupReadAction(id: string, isRead = true) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();

  if (!id) return;

  await markFollowupRead(id, isRead);
  revalidatePath("/dashboard");
}

export async function bulkApproveFollowupsAction(ids: string[]) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();
  if (!Array.isArray(ids) || ids.length === 0) return;

  await bulkApproveFollowups(ids);
  revalidatePath("/dashboard");
}

export async function bulkDismissFollowupsAction(ids: string[]) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();
  if (!Array.isArray(ids) || ids.length === 0) return;

  await bulkDismissFollowups(ids);
  revalidatePath("/dashboard");
}

export async function bulkMoveToCategoryAction(
  ids: string[],
  category: FollowupCategory
) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();
  if (!Array.isArray(ids) || ids.length === 0) return;

  await bulkMoveToCategory(ids, category);
  revalidatePath("/dashboard");
}

export async function bulkMarkReadAction(ids: string[]) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();
  if (!Array.isArray(ids) || ids.length === 0) return;

  await bulkMarkReadState(ids, true);
  revalidatePath("/dashboard");
}

export async function bulkMarkUnreadAction(ids: string[]) {
  // Enforce authentication and allowlist check
  await getUserOrRedirect();
  if (!Array.isArray(ids) || ids.length === 0) return;

  await bulkMarkReadState(ids, false);
  revalidatePath("/dashboard");
}
