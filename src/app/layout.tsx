import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Follow-Up Inbox",
  description:
    "A calm inbox for approving or dismissing AI-prepared follow-up messages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

