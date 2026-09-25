import type {
  IncomingMessage,
  ServerResponse,
} from "node:http";
import { requireAuth } from "../middleware/authMiddleware";
import { db } from "../db/client";
import {
  error,
  json,
  readJson,
  stringValue,
} from "../utils/api";

type AssistantContext = {
  profile: {
    name: string;
    headline: string;
    country: string;
    followers: number;
    posts: number;
    impressions: number;
    engagements: number;
    cardStatus: string;
    hasLinkedIn: boolean;
    hasX: boolean;
  };
  activity: {
    applications: number;
    collaborations: number;
    availableEarningsCents: number;
    openCampaigns: number;
  };
};

function getContext(
  userId: string,
): AssistantContext {
  const profile = db
    .prepare(
      "SELECT name,headline,country,followers,card_status,linkedin_url,x_profile_url FROM creator_profiles WHERE user_id=?",
    )
    .get(userId) as
    | {
        name: string | null;
        headline: string | null;
        country: string | null;
        followers: number | null;
        card_status: string | null;
        linkedin_url: string | null;
        x_profile_url: string | null;
      }
    | undefined;

  const analytics = db
    .prepare(
      "SELECT COUNT(*) AS posts,COALESCE(SUM(impressions),0) AS impressions,COALESCE(SUM(engagements),0) AS engagements FROM analytics_posts WHERE creator_id=?",
    )
    .get(userId) as {
      posts: number;
      impressions: number;
      engagements: number;
    };

  const applications = db
    .prepare(
      "SELECT COUNT(*) AS count FROM applications WHERE creator_id=?",
    )
    .get(userId) as {
      count: number;
    };

  const collaborations = db
    .prepare(
      "SELECT COUNT(*) AS count FROM collaborations WHERE creator_id=? AND status NOT IN ('declined','cancelled','completed')",
    )
    .get(userId) as {
      count: number;
    };

  const earnings = db
    .prepare(
      "SELECT COALESCE(SUM(CASE WHEN status='available' THEN amount_cents ELSE 0 END),0) AS available FROM earnings WHERE user_id=?",
    )
    .get(userId) as {
      available: number;
    };

  const campaigns = db
    .prepare(
      "SELECT COUNT(*) AS count FROM campaigns WHERE status='open'",
    )
    .get() as {
      count: number;
    };

  return {
    profile: {
      name:
        String(profile?.name ?? "").trim() ||
        "Creator",
      headline:
        String(profile?.headline ?? "").trim(),
      country:
        String(profile?.country ?? "").trim() ||
        "Global",
      followers: Number(
        profile?.followers ?? 0,
      ),
      posts: Number(
        analytics.posts ?? 0,
      ),
      impressions: Number(
        analytics.impressions ?? 0,
      ),
      engagements: Number(
        analytics.engagements ?? 0,
      ),
      cardStatus:
        String(
          profile?.card_status ?? "",
        ),
      hasLinkedIn:
        Boolean(
          String(
            profile?.linkedin_url ?? "",
          ).trim(),
        ),
      hasX:
        Boolean(
          String(
            profile?.x_profile_url ?? "",
          ).trim(),
        ),
    },
    activity: {
      applications: Number(
        applications.count ?? 0,
      ),
      collaborations: Number(
        collaborations.count ?? 0,
      ),
      availableEarningsCents:
        Number(
          earnings.available ?? 0,
        ),
      openCampaigns: Number(
        campaigns.count ?? 0,
      ),
    },
  };
}

function formatCurrency(
  cents: number,
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    },
  ).format(cents / 100);
}

function answerQuestion(
  question: string,
  context: AssistantContext,
) {
  const value = question
    .trim()
    .toLowerCase();

  if (
    /performance|analytics|reach|impression|engagement|followers|post/.test(
      value,
    )
  ) {
    return (
      `Here is your current performance snapshot: ` +
      `${context.profile.followers.toLocaleString()} LinkedIn followers, ` +
      `${context.profile.posts.toLocaleString()} public posts, ` +
      `${context.profile.impressions.toLocaleString()} impressions and ` +
      `${context.profile.engagements.toLocaleString()} engagements. ` +
      (context.profile.posts === 0
        ? "No public post analytics are available yet."
        : "Those numbers are calculated from the analytics stored in your Naano workspace.")
    );
  }

  if (
    /card|profile|headline|positioning/.test(
      value,
    )
  ) {
    if (
      context.profile.cardStatus ===
      "published"
    ) {
      return (
        "Your creator card is published and ready to share. " +
        "You can review it from My Card."
      );
    }

    return (
      "Your creator card is not published yet. " +
      "Complete the remaining creator-card details before sharing it publicly."
    );
  }

  if (
    /earning|money|payout|withdraw/.test(
      value,
    )
  ) {
    return (
      "Your currently available earnings are " +
      formatCurrency(
        context.activity
          .availableEarningsCents,
      ) +
      ". You can manage payout methods and withdrawals from Earnings."
    );
  }

  if (
    /campaign|opportunit|brand/.test(
      value,
    )
  ) {
    return (
      `There are currently ${context.activity.openCampaigns.toLocaleString()} open campaign(s) in the marketplace. ` +
      "Open Opportunities to review the live briefs and apply."
    );
  }

  if (
    /collaboration|deliver|project/.test(
      value,
    )
  ) {
    return (
      `You currently have ${context.activity.collaborations.toLocaleString()} active collaboration(s). ` +
      "Open Collaborations to track delivery and status."
    );
  }

  if (
    /social|linkedin|twitter|x profile/.test(
      value,
    )
  ) {
    return (
      "Your workspace has " +
      (context.profile.hasLinkedIn
        ? "a LinkedIn profile"
        : "no LinkedIn profile") +
      " and " +
      (context.profile.hasX
        ? "an X profile"
        : "no X profile") +
      " connected."
    );
  }

  if (/help|what can you|how does/.test(value)) {
    return (
      "I can help you understand your performance, creator card, opportunities, collaborations and earnings using the data in this workspace."
    );
  }

  return (
    "I can answer questions about your Naano workspace data, including performance, your creator card, opportunities, collaborations and earnings. Try asking about one of those areas."
  );
}

export function assistantContext(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(
    request,
    response,
  );

  if (!user) {
    return;
  }

  return json(response, 200, {
    data: getContext(user.id),
  });
}

export async function assistantMessage(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const user = requireAuth(
    request,
    response,
  );

  if (!user) {
    return;
  }

  const body = await readJson(request);
  const question = stringValue(
    body.message,
  ).trim();

  if (!question) {
    return error(
      response,
      422,
      "MESSAGE_REQUIRED",
      "Message cannot be empty.",
    );
  }

  if (question.length > 1000) {
    return error(
      response,
      422,
      "MESSAGE_TOO_LONG",
      "Message must be 1000 characters or fewer.",
    );
  }

  const context = getContext(
    user.id,
  );

  return json(response, 200, {
    data: {
      answer: answerQuestion(
        question,
        context,
      ),
      context,
    },
  });
}
