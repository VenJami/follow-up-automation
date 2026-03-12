"use client";

interface MessageAvatarProps {
  name: string | null | undefined;
  email: string | null | undefined;
  size?: "sm" | "md" | "lg";
}

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name) {
    // Extract first letter of first word and first letter of last word
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || "?";
  }
  
  if (email) {
    return email[0]?.toUpperCase() || "?";
  }
  
  return "?";
}

function getAvatarColor(name: string | null | undefined, email: string | null | undefined): string {
  const str = name || email || "";
  // Simple hash to get consistent color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Gmail-like color palette
  const colors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

export function MessageAvatar({ name, email, size = "md" }: MessageAvatarProps) {
  const initials = getInitials(name, email);
  const colorClass = getAvatarColor(name, email);
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} flex items-center justify-center rounded-full text-white font-medium shrink-0`}
    >
      {initials}
    </div>
  );
}
