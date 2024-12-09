import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function timeAgo(date?: Date | string): string {
  console.log(date);
  if (typeof date === "string") date = new Date(date);
  if (!date) return "just now";
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

export function prettyDate(date: string | Date | undefined | null) {
  if (!date) return "";
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric"
  });
}
