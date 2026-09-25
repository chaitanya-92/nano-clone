import type { User } from "@/features/authSlice";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.error?.message ?? body?.error ?? "Request failed.");
  }

  return body;
}

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

export interface DashboardResponse {
  data: {
    role: "creator" | "brand";
    profile?: CreatorProfile;
    metrics: Record<string, number>;
    earnings: {
      available: number;
      total: number;
    };
    notifications: Array<Record<string, unknown>>;
  };
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  brief: string;
  deliverables: string;
  requirements: string;
  budget_cents: number;
  currency: string;
  application_deadline: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  min_followers: number;
  max_applications: number | null;
  brand_name?: string;
}

export interface Collaboration {
  id: string;
  campaign_title: string;
  creator_name: string;
  brand_name: string;
  status: string;
  brief: string;
  content_url: string | null;
  published_url: string | null;
  due_at: string | null;
  impressions: number;
  engagements: number;
  net_amount_cents: number;
}

export interface AnalyticsResponse {
  data: {
    range: string;
    profile: {
      followers: number;
      impressions: number;
      engagement_count: number;
      post_count: number;
    };
    summary: {
      posts: number;
      impressions: number;
      reach: number;
      likes: number;
      comments: number;
      reposts: number;
      engagements: number;
    };
    posts: Array<{
      id: string;
      platform: string;
      url: string | null;
      text: string;
      published_at: string;
      impressions: number;
      reach: number;
      likes: number;
      comments: number;
      reposts: number;
      engagements: number;
    }>;
  };
}

export interface EarningsResponse {
  data: {
    summary: {
      total_earned: number;
      available: number;
      in_transit: number;
      withdrawn: number;
    };
    activity: Array<{
      id: string;
      type: string;
      status: string;
      amount_cents: number;
      currency: string;
      description: string;
      created_at: string;
    }>;
  };
}

export interface PayoutMethod {
  id: string;
  type: string;
  label: string;
  status: string;
  created_at: string;
}

export interface AffiliateResponse {
  data: {
    referrals: Array<Record<string, unknown>>;
    rewards: Array<Record<string, unknown>>;
  };
}

export interface Conversation {
  id: string;
  subject: string;
  status: string;
  creator_name: string;
  brand_name: string;
  last_message: string | null;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface CommunityResponse {
  data: {
    leaderboard: Array<{
      id: string;
      name: string;
      slug: string | null;
      headline: string;
      followers: number;
      impressions: number;
      post_count: number;
      engagement_count: number;
    }>;
    member: CreatorProfile | null;
  };
}

export function getDashboard() {
  return request<DashboardResponse>("/api/dashboard");
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

export function getCampaigns() {
  return request<{ data: Campaign[] }>("/api/campaigns");
}

export function getApplications() {
  return request<{
    data: Array<Record<string, unknown>>;
  }>("/api/applications");
}

export function applyToCampaign(
  campaignId: string,
  payload: {
    message: string;
    proposedPriceCents?: number;
  },
) {
  return request<{
    data: Record<string, unknown>;
  }>("/api/campaigns/" + campaignId + "/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCollaborations() {
  return request<{ data: Collaboration[] }>("/api/collaborations");
}

export function updateCollaboration(
  id: string,
  payload: Record<string, unknown>,
) {
  return request<{ data: Collaboration }>("/api/collaborations/" + id, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAnalytics(range: "all" | "30d" | "90d") {
  return request<AnalyticsResponse>("/api/analytics?range=" + range);
}

export function getEarnings() {
  return request<EarningsResponse>("/api/earnings");
}

export function getPayoutMethods() {
  return request<{ data: PayoutMethod[] }>("/api/earnings/payout-methods");
}

export function addPayoutMethod(payload: { type: string; label: string }) {
  return request<{ data: PayoutMethod }>("/api/earnings/payout-methods", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function requestWithdrawal(payload: {
  payoutMethodId: string;
  amountCents: number;
}) {
  return request<{
    data: Record<string, unknown>;
  }>("/api/earnings/withdrawals", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAffiliate() {
  return request<AffiliateResponse>("/api/affiliate");
}

export function createReferral(type: "creator" | "brand") {
  return request<{
    data: {
      id: string;
      type: string;
      code: string;
      status: string;
    };
  }>("/api/affiliate/referral-links", {
    method: "POST",
    body: JSON.stringify({ type }),
  });
}

export function getConversations() {
  return request<{ data: Conversation[] }>("/api/conversations");
}

export function getMessages(conversationId: string) {
  return request<{ data: Message[] }>(
    "/api/conversations/" + conversationId + "/messages",
  );
}

export function sendConversationMessage(conversationId: string, body: string) {
  return request<{ data: Message }>(
    "/api/conversations/" + conversationId + "/messages",
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
  );
}

export function markConversationRead(conversationId: string) {
  return request<{ ok: true }>(
    "/api/conversations/" + conversationId + "/read",
    {
      method: "PATCH",
    },
  );
}

export function getCommunity() {
  return request<CommunityResponse>("/api/community");
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
  }>("/api/creator/card/" + slug);
}

export function getPublicCardUrl(slug: string) {
  return window.location.origin + "/creator/" + slug;
}

export function getCurrentUser() {
  return request<{ user: User | null }>("/api/auth/me");
}

export function deleteAccount() {
  return request<{ ok: true }>("/api/auth/account", {
    method: "DELETE",
  });
}
