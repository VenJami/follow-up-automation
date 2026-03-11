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

/**
 * Sends a reply email via n8n webhook.
 * n8n handles the actual Gmail API call and updates Supabase.
 */
export async function sendReplyViaN8nAction(formData: FormData) {
  // Enforce authentication and allowlist check
  const user = await getUserOrRedirect();

  const followupId = formData.get("followupId");
  const threadId = formData.get("threadId");
  const replyBody = formData.get("replyBody");
  const userEmail = formData.get("userEmail");

  if (
    typeof followupId !== "string" ||
    typeof threadId !== "string" ||
    typeof replyBody !== "string" ||
    typeof userEmail !== "string"
  ) {
    throw new Error("Missing required fields");
  }

  // Get n8n webhook URL from environment (server-side only)
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nWebhookUrl) {
    throw new Error("N8N_WEBHOOK_URL not configured");
  }

  // Optional: webhook secret for authentication
  const n8nWebhookSecret = process.env.N8N_WEBHOOK_SECRET;

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(n8nWebhookSecret && { "X-Webhook-Secret": n8nWebhookSecret }),
      },
      body: JSON.stringify({
        followupId,
        threadId,
        replyBody,
        userEmail,
        // Include user context for n8n to verify/audit
        senderEmail: user.email,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8n webhook failed: ${response.status} ${errorText}`);
    }

    // n8n should handle updating Supabase (has_reply, etc.)
    // We revalidate to refresh the UI
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error sending reply via n8n:", error);
    throw error;
  }
}
