export type SocialProvider =
  | "linkedin"
  | "x";

export interface PublicSocialProfile {
  username: string | null;
  name: string | null;
  headline: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  followers: number | null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readMeta(
  html: string,
  attribute: "property" | "name",
  value: string,
) {
  const safeValue = value.replace(
    /[.*+?^{}()|[\]\\]/g,
    "\\$&",
  );

  const firstPattern = new RegExp(
    "<meta[^>]+" +
      attribute +
      "=['\"]" +
      safeValue +
      "['\"][^>]+content=['\"]([^'\"]*)['\"]",
    "i",
  );

  const secondPattern = new RegExp(
    "<meta[^>]+content=['\"]([^'\"]*)['\"][^>]+" +
      attribute +
      "=['\"]" +
      safeValue +
      "['\"]",
    "i",
  );

  const match =
    firstPattern.exec(html) ??
    secondPattern.exec(html);

  return match
    ? decodeHtml(match[1]).trim()
    : null;
}

function readTitle(html: string) {
  const match =
    /<title[^>]*>([\s\S]*?)<\/title>/i.exec(
      html,
    );

  if (!match) {
    return null;
  }

  return decodeHtml(
    match[1].replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function parseFollowers(
  text: string | null,
) {
  if (!text) {
    return null;
  }

  const match = text
    .replace(/,/g, "")
    .match(
      /(\d+(?:\.\d+)?)\s*([KMB])?\s*followers?/i,
    );

  if (!match) {
    return null;
  }

  const value = Number(match[1]);

  if (!Number.isFinite(value)) {
    return null;
  }

  const suffix =
    match[2]?.toUpperCase();

  const multiplier =
    suffix === "K"
      ? 1_000
      : suffix === "M"
        ? 1_000_000
        : suffix === "B"
          ? 1_000_000_000
          : 1;

  return Math.round(
    value * multiplier,
  );
}

function getUsername(
  provider: SocialProvider,
  profileUrl: string,
) {
  const pathname = new URL(
    profileUrl,
  ).pathname
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  if (provider === "linkedin") {
    return (
      pathname.split("/")[1] ??
      null
    );
  }

  return pathname.split("/")[0] ?? null;
}

function getName(
  provider: SocialProvider,
  title: string | null,
  ogTitle: string | null,
) {
  const value =
    ogTitle ||
    title ||
    "";

  if (!value) {
    return null;
  }

  if (provider === "x") {
    const match = value.match(
      /^(.+?)\s*\(@[A-Za-z0-9_]+\)/,
    );

    return (
      match?.[1]?.trim() ??
      value.split("|")[0].trim()
    );
  }

  return value
    .split("|")[0]
    .replace(
      /\s*[-–—]\s*LinkedIn.*$/i,
      "",
    )
    .trim();
}

export async function fetchPublicSocialProfile(
  provider: SocialProvider,
  profileUrl: string,
): Promise<PublicSocialProfile> {
  const abortController =
    new AbortController();

  const timeout = setTimeout(
    () => abortController.abort(),
    8000,
  );

  try {
    const response = await fetch(
      profileUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 NaanoProfileFetcher/1.0",
          Accept:
            "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        signal: abortController.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        "The public social profile could not be fetched.",
      );
    }

    const html =
      await response.text();

    const title = readTitle(html);
    const ogTitle = readMeta(
      html,
      "property",
      "og:title",
    );
    const description =
      readMeta(
        html,
        "property",
        "og:description",
      ) ??
      readMeta(
        html,
        "name",
        "description",
      );

    return {
      username:
        readMeta(
          html,
          "name",
          "twitter:creator",
        )?.replace(/^@/, "") ??
        getUsername(
          provider,
          profileUrl,
        ),
      name: getName(
        provider,
        title,
        ogTitle,
      ),
      headline:
        provider === "linkedin"
          ? description
          : null,
      bio:
        provider === "x"
          ? description
          : null,
      profileImageUrl:
        readMeta(
          html,
          "property",
          "og:image",
        ),
      followers:
        parseFollowers(description),
    };
  } finally {
    clearTimeout(timeout);
  }
}
