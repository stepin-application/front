import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "campagne";
}

export function campaignPath(id: string, title?: string) {
  const slug = slugify(title || "campagne");
  return `/campaigns/${slug}?id=${id}`;
}

export function campaignApplyPath(id: string, title?: string) {
  const slug = slugify(title || "campagne");
  return `/campaigns/${slug}/apply?id=${id}`;
}

export function campaignParticipantsPath(id: string, title?: string) {
  const slug = slugify(title || "campagne");
  return `/campaigns/${slug}/participants?id=${id}`;
}

export function schoolCampaignEditPath(id: string, title?: string) {
  const slug = slugify(title || "campagne");
  return `/campaigns/school/${slug}/edit?id=${id}`;
}

export function schoolCampaignInvitePath(id: string, title?: string) {
  const slug = slugify(title || "campagne");
  return `/campaigns/school/${slug}/invite?id=${id}`;
}
