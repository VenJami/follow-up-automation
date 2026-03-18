"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export type SelectedPlatform = "google" | "facebook" | "internal" | "video";

export async function upsertReviewInviteAction(input: {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("review_invites").upsert(
    {
      token: input.token,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      consent: input.consent,
      status: "started",
    },
    { onConflict: "token" }
  );

  if (error) {
    throw new Error(`Failed to save review invite: ${error.message}`);
  }
}

export async function setSelectedPlatformAction(input: {
  token: string;
  platform: SelectedPlatform;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("review_invites")
    .update({ selected_platform: input.platform })
    .eq("token", input.token);

  if (error) {
    throw new Error(`Failed to track platform: ${error.message}`);
  }
}

export async function submitInternalReviewAction(input: {
  token: string;
  rating: number;
  body: string;
  imageUrl?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { data: invite, error: inviteError } = await supabase
    .from("review_invites")
    .select("first_name,last_name")
    .eq("token", input.token)
    .maybeSingle();

  if (inviteError) {
    throw new Error(`Failed to load invite for review: ${inviteError.message}`);
  }

  const authorName = invite
    ? `${invite.first_name ?? ""} ${invite.last_name ?? ""}`.trim()
    : "";

  const { error: insertError } = await supabase.from("reviews").insert({
    invite_token: input.token,
    rating: input.rating,
    body: input.body,
    image_url: input.imageUrl ?? null,
    author_name: authorName || "Anonymous",
    source: "website",
    review_date: new Date().toISOString(),
  });

  if (insertError) {
    throw new Error(`Failed to submit review: ${insertError.message}`);
  }

  const { error: updateError } = await supabase
    .from("review_invites")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("token", input.token);

  if (updateError) {
    throw new Error(`Failed to mark invite completed: ${updateError.message}`);
  }
}

