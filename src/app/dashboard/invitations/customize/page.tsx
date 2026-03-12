import type { Metadata } from "next";
import { CustomizeInvitationClient } from "@/components/CustomizeInvitationClient";

export const metadata: Metadata = {
  title: "Customize Invitation | Follow-Up Inbox",
};

export default function CustomizeInvitationPage() {
  return <CustomizeInvitationClient />;
}

