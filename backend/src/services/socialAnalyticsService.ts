import { db } from "../db/client";
import { LINKEDIN_API_VERSION, X_BEARER_TOKEN } from "../config/env";

type Provider = "linkedin" | "x";

type SyncStatus = {
  provider: Provider;
  status: "synced" | "unavailable" | "error";
  message: string;
  syncedAt: string | null;
};

const LINKEDIN_BASE = "https://api.linkedin.com/rest";
const X_BASE = "https://api.x.com/2";

async function readJson(response: Response) {
  const body = await response.text();
  let parsed: any = null;
  try {
    parsed = body ? JSON.parse(body) : null;
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const detail =
      parsed?.detail ??
      parsed?.message ??
      parsed?.error_description ??
      `Provider returned HTTP ${response.status}.`;
    throw new Error(String(detail));
  }

  return parsed;
}

async function xRequest(path: string) {
  if (!X_BEARER_TOKEN) {
    throw new Error("X API bearer token is not configured.");
  }

  const response = await fetch(X_BASE + path, {
    headers: {
      Authorization: `Bearer ${X_BEARER_TOKEN}`,
      Accept: "application/json",
    },
  });

  return readJson(response);
}

function metricNumber(value: unknown) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
}

async function syncX(userId: string, account: any) {
  const username = String(account.username ?? "").replace(/^@/, "");

  if (!username) {
    throw new Error("The connected X account has no username.");
  }

  const userResponse = await xRequest(
    `/users/by/username/${encodeURIComponent(username)}?user.fields=public_metrics,profile_image_url,name,description,username`,
  );

  const xUser = userResponse?.data;

  if (!xUser?.id) {
    throw new Error("X could not resolve the connected profile.");
  }

  const followers = metricNumber(xUser.public_metrics?.followers_count);

  db.prepare(
    "UPDATE social_accounts SET provider_user_id=?,username=?,profile_image_url=?,status='connected',updated_at=? WHERE id=? AND user_id=?",
  ).run(
    String(xUser.id),
    xUser.username ?? username,
    xUser.profile_image_url ?? null,
    new Date().toISOString(),
    account.id,
    userId,
  );

  const posts: any[] = [];
  let nextToken: string | undefined;

  for (let page = 0; page < 20; page += 1) {
    const query = new URLSearchParams({
      "tweet.fields": "created_at,public_metrics",
      max_results: "100",
    });

    if (nextToken) query.set("pagination_token", nextToken);

    const response = await xRequest(
      `/users/${encodeURIComponent(String(xUser.id))}/tweets?${query.toString()}`,
    );

    posts.push(...(Array.isArray(response?.data) ? response.data : []));
    nextToken = response?.meta?.next_token;

    if (!nextToken || !response?.data?.length) break;
  }

  const timestamp = new Date().toISOString();
  const totalImpressions = posts.reduce(
    (sum, post) => sum + metricNumber(post.public_metrics?.impression_count),
    0,
  );
  const totalEngagements = posts.reduce((sum, post) => {
    const m = post.public_metrics ?? {};
    return (
      sum +
      metricNumber(m.like_count) +
      metricNumber(m.reply_count) +
      metricNumber(m.retweet_count) +
      metricNumber(m.quote_count) +
      metricNumber(m.bookmark_count)
    );
  }, 0);
  const upsert = db.prepare(
    `INSERT INTO analytics_posts
      (id,creator_id,platform,external_id,url,text,published_at,impressions,reach,likes,comments,reposts,engagements,created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       url=excluded.url,text=excluded.text,published_at=excluded.published_at,
       impressions=excluded.impressions,reach=excluded.reach,likes=excluded.likes,
       comments=excluded.comments,reposts=excluded.reposts,engagements=excluded.engagements`,
  );

  const write = db.transaction(() => {
    for (const post of posts) {
      const metrics = post.public_metrics ?? {};
      const likes = metricNumber(metrics.like_count);
      const comments = metricNumber(metrics.reply_count);
      const reposts =
        metricNumber(metrics.retweet_count) + metricNumber(metrics.quote_count);
      const impressions = metricNumber(metrics.impression_count);
      const engagements =
        likes + comments + reposts + metricNumber(metrics.bookmark_count);

      upsert.run(
        `x:${post.id}`,
        userId,
        "x",
        String(post.id),
        `https://x.com/${xUser.username}/status/${post.id}`,
        String(post.text ?? ""),
        post.created_at ?? timestamp,
        impressions,
        impressions,
        likes,
        comments,
        reposts,
        engagements,
        timestamp,
      );
    }

    db.prepare(
      "UPDATE creator_profiles SET x_profile_url=?,profile_photo_url=COALESCE(?,profile_photo_url),followers=?,updated_at=? WHERE user_id=?",
    ).run(
      account.profile_url,
      xUser.profile_image_url ?? null,
      followers,
      timestamp,
      userId,
    );

    db.prepare(
      "UPDATE social_accounts SET followers_count=?,impressions=?,engagements=?,posts_count=?,last_synced_at=?,sync_error=NULL,updated_at=? WHERE id=? AND user_id=?",
    ).run(
      followers,
      totalImpressions,
      totalEngagements,
      posts.length,
      timestamp,
      timestamp,
      account.id,
      userId,
    );
  });

  write();

  return {
    posts: posts.length,
    followers,
    syncedAt: timestamp,
  };
}

async function linkedinRequest(token: string, path: string) {
  const response = await fetch(LINKEDIN_BASE + path, {
    headers: {
      Authorization: `Bearer ${token}`,
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
      Accept: "application/json",
    },
  });

  return readJson(response);
}

function linkedinMetricType(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const values = Object.values(value as Record<string, unknown>);
    return String(values[0] ?? "");
  }
  return "";
}

async function linkedinMetric(token: string, postUrn: string, metric: string) {
  const entityType = postUrn.includes("ugcPost") ? "ugc" : "share";
  const encoded = encodeURIComponent(postUrn);
  const entity = `(${entityType}:${encoded})`;
  const response = await linkedinRequest(
    token,
    `/memberCreatorPostAnalytics?q=entity&entity=${entity}&queryType=${metric}&aggregation=TOTAL`,
  );

  const element = Array.isArray(response?.elements)
    ? response.elements[0]
    : null;

  return metricNumber(element?.count);
}

async function syncLinkedIn(userId: string, account: any) {
  const token = String(account.access_token ?? "");
  const personId = String(account.provider_user_id ?? "");

  if (!token || !personId) {
    throw new Error(
      "LinkedIn analytics access is not connected. Re-authorize LinkedIn with analytics permissions.",
    );
  }

  const followerResponse = await linkedinRequest(
    token,
    "/memberFollowersCount?q=me",
  );

  const followers = metricNumber(
    followerResponse?.elements?.[0]?.memberFollowersCount,
  );

  const author = encodeURIComponent(`urn:li:person:${personId}`);
  const postsResponse = await linkedinRequest(
    token,
    `/posts?author=${author}&q=author&count=100&sortBy=CREATED`,
  );

  const posts = Array.isArray(postsResponse?.elements)
    ? postsResponse.elements
    : [];

  const timestamp = new Date().toISOString();
  const upsert = db.prepare(
    `INSERT INTO analytics_posts
      (id,creator_id,platform,external_id,url,text,published_at,impressions,reach,likes,comments,reposts,engagements,created_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       url=excluded.url,text=excluded.text,published_at=excluded.published_at,
       impressions=excluded.impressions,reach=excluded.reach,likes=excluded.likes,
       comments=excluded.comments,reposts=excluded.reposts,engagements=excluded.engagements`,
  );

  const rows = await Promise.all(
    posts.map(async (post: any) => {
      const id = String(post.id ?? "");
      const impressions = await linkedinMetric(token, id, "IMPRESSION");
      const reach = await linkedinMetric(token, id, "MEMBERS_REACHED");
      const likes = await linkedinMetric(token, id, "REACTION");
      const comments = await linkedinMetric(token, id, "COMMENT");
      const reposts = await linkedinMetric(token, id, "RESHARE");

      return {
        id: `linkedin:${id}`,
        externalId: id,
        text: String(post.commentary ?? ""),
        publishedAt: post.publishedAt
          ? new Date(Number(post.publishedAt)).toISOString()
          : timestamp,
        impressions,
        reach,
        likes,
        comments,
        reposts,
        engagements: likes + comments + reposts,
        url: `https://www.linkedin.com/feed/update/${id}/`,
      };
    }),
  );

  const totalImpressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const totalEngagements = rows.reduce((sum, row) => sum + row.engagements, 0);

  const write = db.transaction(() => {
    for (const row of rows) {
      upsert.run(
        row.id,
        userId,
        "linkedin",
        row.externalId,
        row.url,
        row.text,
        row.publishedAt,
        row.impressions,
        row.reach,
        row.likes,
        row.comments,
        row.reposts,
        row.engagements,
        timestamp,
      );
    }

    db.prepare(
      "UPDATE creator_profiles SET linkedin_url=?,followers=?,updated_at=? WHERE user_id=?",
    ).run(account.profile_url, followers, timestamp, userId);

    db.prepare(
      "UPDATE social_accounts SET followers_count=?,impressions=?,engagements=?,posts_count=?,last_synced_at=?,sync_error=NULL,updated_at=? WHERE id=? AND user_id=?",
    ).run(
      followers,
      totalImpressions,
      totalEngagements,
      rows.length,
      timestamp,
      timestamp,
      account.id,
      userId,
    );
  });

  write();

  return {
    posts: rows.length,
    followers,
    syncedAt: timestamp,
  };
}

export async function syncSocialAnalytics(userId: string) {
  const accounts = db
    .prepare(
      "SELECT * FROM social_accounts WHERE user_id=? AND status='connected' ORDER BY provider",
    )
    .all(userId) as any[];

  const statuses: SyncStatus[] = [];

  for (const account of accounts) {
    const provider = account.provider as Provider;

    try {
      if (provider === "x") {
        const result = await syncX(userId, account);
        statuses.push({
          provider,
          status: "synced",
          message: `Synced ${result.posts} X posts.`,
          syncedAt: result.syncedAt,
        });
      } else {
        const result = await syncLinkedIn(userId, account);
        statuses.push({
          provider,
          status: "synced",
          message: `Synced ${result.posts} LinkedIn posts.`,
          syncedAt: result.syncedAt,
        });
      }
    } catch (value) {
      const message =
        value instanceof Error ? value.message : "Provider sync failed.";

      db.prepare(
        "UPDATE social_accounts SET sync_error=?,updated_at=? WHERE id=? AND user_id=?",
      ).run(message, new Date().toISOString(), account.id, userId);

      statuses.push({
        provider,
        status:
          message.includes("not configured") ||
          message.includes("not connected")
            ? "unavailable"
            : "error",
        message,
        syncedAt: account.last_synced_at ?? null,
      });
    }
  }

  if (!accounts.length) {
    statuses.push({
      provider: "linkedin",
      status: "unavailable",
      message: "Connect LinkedIn to load LinkedIn analytics.",
      syncedAt: null,
    });
    statuses.push({
      provider: "x",
      status: X_BEARER_TOKEN ? "unavailable" : "unavailable",
      message: X_BEARER_TOKEN
        ? "Connect X to load X analytics."
        : "X API bearer token is not configured on the server.",
      syncedAt: null,
    });
  }

  return statuses;
}
