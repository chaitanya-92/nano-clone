import { request } from "@/dashboard/services/apiClient";
import type { User } from "@/features/authSlice";

export interface CreatorProfile {
  user_id: string;
  name: string;
  slug: string | null;
  linkedin_url: string;
  x_profile_url: string;
  headline: string;
  category: string;
  bio: string;
  country: string;
  industries: string;
  followers: number;
  impressions: number;
  engagement_count: number;
  post_count: number;
  profile_photo_url: string | null;
  price_cents: number;
  currency: string;
  card_status: string;
}

export function getCreatorProfile() {
  return request<{ data: CreatorProfile }>("/api/creator/profile");
}

export function updateCreatorProfile(payload: Record<string, unknown>) {
  return request<{ data: CreatorProfile }>("/api/creator/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function publishCreatorCard() {
  return request<{ data: CreatorProfile }>("/api/creator/card/publish", {
    method: "POST",
  });
}

export function unpublishCreatorCard() {
  return request<{ data: CreatorProfile }>("/api/creator/card/publish", {
    method: "DELETE",
  });
}

export function getPublicCreatorCard(slug: string) {
  return request<{
    data: {
      name: string;
      slug: string;
      linkedin_url: string;
      headline: string;
      category: string;
      bio: string;
      country: string;
      industries: string;
      followers: number;
      impressions: number;
      engagement_count: number;
      post_count: number;
      profile_photo_url: string | null;
      price_cents: number;
      currency: string;
    };
  }>("/api/creator/card/" + encodeURIComponent(slug));
}

export function getPublicCardUrl(slug: string) {
  return window.location.origin + "/creator/" + encodeURIComponent(slug);
}
