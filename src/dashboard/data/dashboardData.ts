export const overviewStats = [
  {
    label: "PUBLIC POST REACH",
    value: "—",
    description: "Waiting for public post data",
  },
  {
    label: "PUBLIC POSTS",
    value: "0",
    description: "Original LinkedIn posts found",
  },
  {
    label: "PUBLIC ENGAGEMENTS",
    value: "0",
    description: "Reactions, comments and reposts",
  },
  {
    label: "LINKEDIN FOLLOWERS",
    value: "—",
    description: "Imported from the public profile",
  },
] as const;

export const creatorCard = {
  title: "Your creator card",
  description:
    "This is how brands discover your positioning and collaboration offer.",
  actions: {
    open: "Open card",
    copy: "Copy card link",
    share: "Share my card",
  },
} as const;

export const launchGuide = {
  title: "Your launch guide",
  progress: "1 of 1 steps complete",
  action: "Open card",
  step: {
    title: "Card and price ready",
    description: "Your positioning and offer are ready to review.",
    status: "Complete",
  },
} as const;

export const myCardData = {
  eyebrow: "YOUR CREATOR STOREFRONT",
  title: "Your Naano card, ready to travel.",
  description:
    "Share clear proof of your positioning, audience and offers. Every improvement makes the card more useful to brands.",
  share: {
    eyebrow: "YOUR CARD IS YOUR DEAL LINK",
    title: "Put it on LinkedIn. Earn when a brand joins through it.",
    description:
      "Your public card presents your profile and keeps you selected when a brand creates its account.",
    items: [
      {
        title: "Add it as a LinkedIn experience",
        description:
          "Keep your card visible on your profile so brands can discover and book you.",
      },
      {
        title: "Send it when a brand contacts you",
        description:
          "When you receive a collaboration request, share your card so the deal runs through Naano.",
      },
    ],
    sharePercent: "25%",
    rewardPeriod: "3 months",
  },
  profile: {
    name: "Lord Lord",
    category: "Web3 / Crypto",
    headline: "Your LinkedIn headline and topics will appear here.",
    followers: "—",
    impressions: "—",
    cost: "€240",
  },
  photoModal: {
    title: "Profile photo",
    description: "JPG, PNG, WebP or GIF. Max 2MB.",
  },
} as const;

export const opportunitiesData = {
  title: "Opportunities",
  description:
    "Open brand campaigns - apply, the brand accepts, and the booking is created on your terms.",
  locked: {
    title: "Paid campaigns open at 1,000 followers",
    description:
      "You have 0 followers. Keep posting and come back - re-check your count once a week from Settings.",
  },
} as const;

export const collaborationsData = {
  title: "Collaborations",
  description:
    "Every step tells you where you stand, what to do, and what happens if you do nothing.",
  tabs: [
    { id: "all", label: "All", count: 0 },
    { id: "active", label: "Active", count: 0 },
    { id: "needs-action", label: "Needs action", count: 0 },
    { id: "applications", label: "Applications sent", count: 0 },
    { id: "declined", label: "Declined", count: 0 },
    { id: "completed", label: "Completed", count: 0 },
  ],
  columns: [
    "Brand",
    "Campaign",
    "Status",
    "Performance",
    "Next action",
    "Due date",
    "Your net",
  ],
  tables: {
    all: {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
    active: {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
    "needs-action": {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
    applications: {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
    declined: {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
    completed: {
      emptyMessage: "Nothing in this tab.",
      total: "0 collaborations",
    },
  },
} as const;

export const analyticsData = {
  title: "Analytics",
  description: "Public LinkedIn performance imported for this profile.",
  timeRanges: ["Last 30 days", "Last 90 days", "All time"],
  defaultTimeRange: "All time",
  snapshot: {
    eyebrow: "PUBLIC LINKEDIN SNAPSHOT",
    title: "Public LinkedIn posts are being imported",
    description:
      "The profile is ready. Post history and reach will appear after the public-data job completes.",
    percentage: "0%",
    percentageDescription: "of imported posts include reach data",
    status: "No public post found yet",
  },
  stats: [
    {
      label: "Public posts",
      value: "0",
      description: "Original LinkedIn posts found",
      icon: "posts",
    },
    {
      label: "Public post reach",
      value: "Pending",
      description: "Waiting for public post data",
      icon: "reach",
    },
    {
      label: "Public engagements",
      value: "0",
      description: "Reactions, comments and reposts",
      icon: "engagements",
    },
    {
      label: "LinkedIn followers",
      value: "Pending",
      description: "Imported from the public profile",
      icon: "followers",
    },
  ],
  recentPosts: {
    title: "Recent LinkedIn posts",
    description: "Open the original post on LinkedIn.",
    emptyTitle: "Public post import in progress",
    emptyDescription:
      "The first public LinkedIn posts will appear here automatically.",
  },
  profileSummary: {
    title: "Public profile summary",
    description: "Automatically collected from public LinkedIn data.",
    metrics: [
      {
        label: "LinkedIn followers",
        value: "0",
      },
      {
        label: "Public posts",
        value: "0",
      },
      {
        label: "Posts with reach data",
        value: "0",
      },
      {
        label: "Public engagements",
        value: "0",
      },
    ],
  },
  informationBanner: {
    title: "Public LinkedIn data is being prepared",
    description:
      "Naano is collecting the creator's recent public posts. No personal LinkedIn connection is required.",
  },
} as const;

export const earningsData = {
  title: "Earnings",
  description:
    "Track revenue from your paid collaborations and withdraw available funds.",
  badge: "Paid collaborations",
  summary: [
    {
      label: "Total earned",
      value: "€0",
      description: "0 paid collaborations · €0 average",
      icon: "earned",
      cloud: true,
    },
    {
      label: "In transit",
      value: "€0",
      description:
        "International transfers usually arrive within 1–7 days, depending on the destination and banking network.",
      icon: "transit",
      cloud: false,
    },
    {
      label: "Available now",
      value: "€0",
      description: "Ready to withdraw to your selected payout method.",
      icon: "available",
      cloud: false,
    },
  ],
  chart: {
    title: "Earnings over time",
    description: "Net collaboration earnings from the last six months.",
    total: "€0 over 6 months",
    months: [
      { label: "Apr", value: "€0", active: false },
      { label: "May", value: "€0", active: false },
      { label: "Jun", value: "€0", active: false },
      { label: "Jul", value: "€0", active: false },
      { label: "Aug", value: "€0", active: false },
      { label: "Sept", value: "€0", active: true },
    ],
  },
  withdrawal: {
    title: "Withdraw earnings",
    description: "Choose where your available balance should be sent.",
    label: "PAYOUT METHOD",
    methods: [
      {
        id: "bank",
        name: "Bank transfer",
        description: "No account holder on file",
        subDescription: "No bank details on file",
        action: "Edit",
      },
      {
        id: "stripe",
        name: "Stripe",
        description: "Status: Not connected",
        subDescription: "Instant transfer to your connected Stripe account.",
        action: "Connect Stripe",
      },
    ],
    amountPlaceholder: "Amount",
    withdrawAll: "Withdraw all",
    confirm: "Confirm withdrawal",
    emptyMessage: "No earnings are currently waiting for release.",
  },
  activity: {
    title: "Recent activity",
    description:
      "Collaboration earnings, withdrawals and invoices in one place.",
    tabs: [
      {
        id: "earnings",
        label: "Earnings and withdrawals",
        count: null,
      },
      {
        id: "release",
        label: "Awaiting release",
        count: 0,
      },
      {
        id: "invoices",
        label: "Invoices",
        count: 0,
      },
    ],
    columns: ["Date", "Type", "Detail", "Amount", "Status", "Invoice"],
    emptyMessage: "No movements yet. Your first payment will appear here.",
  },
} as const;

export const communityData = {
  title: "Community",
  description:
    "Learn with other B2B creators, share what works and make your Naano identity visible.",
  badge: "Creator network",
  slack: {
    eyebrow: "NAANO CREATORS ON SLACK",
    title: "The room where B2B creators get better together.",
    description:
      "Ask for feedback on a sponsored post, compare campaign lessons, meet creators in your language and help shape what Naano builds next.",
    benefits: [
      "Get feedback before you publish",
      "Share campaign tips that work",
      "Talk directly with the Naano team",
    ],
    action: "Join the Slack community",
  },
  linkedin: {
    eyebrow: "LINKEDIN VISIBILITY",
    title: "Turn your LinkedIn profile into an always-on Deal Link",
    description:
      "Add your creator card to LinkedIn so brands can discover your work and join Naano through your attributed link.",
    commission: "25%",
    commissionText: "of Naano's commission for 3 months",
    note: "Leave your card on your LinkedIn profile. If a brand joins Naano through it, your reward is tracked automatically.",
    creator: {
      name: "Naano Creator",
      subtitle: "Naano · Independent",
      status: "Present",
      initials: "L",
      category: "Web3 / Crypto",
      followers: "—",
      impressions: "—",
      chosenCost: "€240",
    },
    action: "Publish my card",
  },
  leaderboard: {
    title: "Naano campaign leaderboard",
    description:
      "Estimated impressions generated by sponsored posts published for Naano brand collaborations.",
    metrics: {
      impressions: "Estimated impressions",
      posts: "Posts",
    },
    creators: [
      {
        rank: 1,
        name: "Eric David",
        type: "Public creator card",
        impressions: "267K",
        posts: 18,
      },
      {
        rank: 2,
        name: "Thomas Marcelle",
        type: "Public creator card",
        impressions: "170K",
        posts: 12,
      },
      {
        rank: 3,
        name: "Joseph Rudd",
        type: "Public creator card",
        impressions: "148K",
        posts: 11,
      },
      {
        rank: 4,
        name: "Emma Guetta",
        type: "Creator",
        impressions: "135K",
        posts: 10,
      },
      {
        rank: 5,
        name: "Kevin Meyer",
        type: "Public creator card",
        impressions: "65K",
        posts: 7,
      },
      {
        rank: 6,
        name: "Raj Vaibhav",
        type: "Public creator card",
        impressions: "45K",
        posts: 6,
      },
      {
        rank: 7,
        name: "TEODORA VUKASIN",
        type: "Creator",
        impressions: "45K",
        posts: 6,
      },
      {
        rank: 8,
        name: "Creator Eight",
        type: "Public creator card",
        impressions: "39K",
        posts: 5,
      },
      {
        rank: 9,
        name: "Creator Nine",
        type: "Creator",
        impressions: "35K",
        posts: 5,
      },
      {
        rank: 10,
        name: "Creator Ten",
        type: "Public creator card",
        impressions: "30K",
        posts: 4,
      },
      {
        rank: 11,
        name: "Mejda Dihi",
        type: "Public creator card",
        impressions: "26K",
        posts: 4,
      },
      {
        rank: 12,
        name: "Mehdi Tetopire",
        type: "Public creator card",
        impressions: "24K",
        posts: 4,
      },
      {
        rank: 13,
        name: "Sandhya Mishra",
        type: "Public creator card",
        impressions: "23K",
        posts: 3,
      },
      {
        rank: 14,
        name: "Tomas Loucky",
        type: "Public creator card",
        impressions: "23K",
        posts: 3,
      },
      {
        rank: 15,
        name: "malmoum chorouk",
        type: "Public creator card",
        impressions: "22K",
        posts: 3,
      },
      {
        rank: 16,
        name: "Divyanshi sharma",
        type: "Creator",
        impressions: "20K",
        posts: 3,
      },
      {
        rank: 17,
        name: "Robin Tempe",
        type: "Creator",
        impressions: "20K",
        posts: 3,
      },
      {
        rank: 18,
        name: "Nick Palasz",
        type: "Creator",
        impressions: "15K",
        posts: 2,
      },
      {
        rank: 19,
        name: "Thomas CLEMENT",
        type: "Public creator card",
        impressions: "14K",
        posts: 2,
      },
      {
        rank: 20,
        name: "Jorge Branger",
        type: "Public creator card",
        impressions: "14K",
        posts: 2,
      },
      {
        rank: 21,
        name: "Yonathan Cohen",
        type: "Creator",
        impressions: "13K",
        posts: 2,
      },
      {
        rank: 22,
        name: "Yonathan levy",
        type: "Public creator card",
        impressions: "13K",
        posts: 2,
      },
      {
        rank: 23,
        name: "Julius Nylund",
        type: "Creator",
        impressions: "11K",
        posts: 2,
      },
      {
        rank: 24,
        name: "Brianna Chapman",
        type: "Creator",
        impressions: "10K",
        posts: 2,
      },
      {
        rank: 25,
        name: "Lazarus Danjuma",
        type: "Public creator card",
        impressions: "9.9K",
        posts: 1,
      },
      {
        rank: 26,
        name: "Théophile Burnet",
        type: "Creator",
        impressions: "9.1K",
        posts: 1,
      },
      {
        rank: 27,
        name: "Kashmala Malik",
        type: "Creator",
        impressions: "8.6K",
        posts: 1,
      },
      {
        rank: 28,
        name: "Dilem Kaya",
        type: "Public creator card",
        impressions: "8.5K",
        posts: 1,
      },
      {
        rank: 29,
        name: "Can Timagur",
        type: "Creator",
        impressions: "7.9K",
        posts: 1,
      },
      {
        rank: 30,
        name: "Raouf Lemouchi",
        type: "Creator",
        impressions: "7.8K",
        posts: 1,
      },
    ],
  },
} as const;

export const affiliateProgramData = {
  tabs: [
    {
      id: "brands",
      label: "Invite brands",
    },
    {
      id: "creators",
      label: "Invite creators",
    },
  ],

  brands: {
    badge: "Creator affiliation · 25% for 3 months",
    title: "Recommend Naano. Earn for 3 months.",
    description:
      "Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano's commission for three months.",
    primaryAction: "Copy my referral link",
    secondaryAction: "See how it works",
    referralLink: "naano.com/invite/you",
    stats: [
      {
        label: "Rewards earned",
        value: "€0.00",
      },
      {
        label: "Brands introduced",
        value: "0",
        description: "0 have generated rewards",
      },
      {
        label: "Earning now",
        value: "0",
        description: "Inside the three-month window",
      },
    ],
    steps: {
      eyebrow: "HOW IT WORKS",
      title: "One link. Three simple steps.",
      items: [
        {
          number: "01",
          title: "Invite a company",
          description:
            "Send your personal link to a company who should be on Naano.",
        },
        {
          number: "02",
          title: "They join and launch",
          description:
            "Their account is automatically connected to your referral.",
        },
        {
          number: "03",
          title: "Earn when they do",
          description:
            "Their first completed paid campaign starts your three-month reward window.",
        },
      ],
    },
    tracking: {
      eyebrow: "LIVE TRACKING",
      title: "Your introduced brands",
      total: "€0.00",
      emptyTitle: "Your first brand will appear here",
      emptyDescription:
        "Share your referral link. Signup, reward window and earnings will update here automatically.",
      action: "Copy my referral link",
    },
  },

  creators: {
    badge: "Creator referrals · 25% for 3 months",
    title: "Invite great creators. Earn when they do.",
    description:
      "When a creator you invite completes their first paid collaboration, you earn 25% of Naano's commission on their collaborations for three months.",
    primaryAction: "Copy my creator invite link",
    helperText: "Publish your Creator Card to unlock your invite link.",
    referralLink: "naano.com/invite/creator/you",
    shareCard: {
      title: "Your creator invite link",
      description: "Every signup is attributed automatically",
      link: "naano.com/invite/creator/you",
      share: "Your share",
      shareValue: "25%",
      window: "Earning window",
      windowValue: "3 months",
      footer:
        "The window starts with their first completed paid collaboration — never at signup.",
    },
    stats: [
      {
        label: "Rewards earned",
        value: "€0.00",
      },
      {
        label: "Creators invited",
        value: "0",
        description: "0 cards published",
      },
      {
        label: "Earning now",
        value: "0",
        description: "Inside the three-month window",
      },
    ],
    steps: {
      eyebrow: "HOW IT WORKS",
      title: "One link. Three simple steps.",
      items: [
        {
          number: "01",
          title: "Invite a creator",
          description:
            "Send your personal link to a creator who should be on Naano.",
        },
        {
          number: "02",
          title: "They join and publish",
          description:
            "Their account and Creator Card are automatically connected to you.",
        },
        {
          number: "03",
          title: "Earn when they do",
          description:
            "Their first completed paid collaboration starts your three-month reward window.",
        },
      ],
    },
    tracking: {
      eyebrow: "LIVE TRACKING",
      title: "Your invited creators",
      total: "€0.00",
      emptyTitle: "Your first invited creator will appear here",
      emptyDescription:
        "Share your creator invite link. Their signup, Creator Card, reward window and earnings will update here automatically.",
      action: "Copy my creator invite link",
    },
  },

  linkChoice: {
    eyebrow: "TWO WAYS TO INTRODUCE A BRAND",
    title: "Choose the link that fits the conversation.",
    description:
      "Both options are tracked and pay you 25% of Naano's commission for three months.",
    options: [
      {
        title: "Recommend Naano",
        badge: "MOST COMMON",
        description:
          "Use your Naano link when a company wants to discover creators or start influencer marketing.",
        action: "Copy Naano link",
      },
      {
        title: "Share your Creator Card",
        description:
          "Use your Deal Link when a brand already wants to collaborate with you. Your profile stays selected when it creates its account.",
        action: "Open My Card",
      },
    ],
  },

  payment: {
    eyebrow: "HOW YOU GET PAID",
    title: "Share once. Naano tracks the rest.",
    steps: [
      {
        number: "01",
        title: "Share the right link",
        description:
          "Use your Naano link for an introduction, or your Creator Card for a direct collaboration.",
      },
      {
        number: "02",
        title: "They launch a campaign",
        description:
          "The company creates its account and completes its first paid campaign.",
      },
      {
        number: "03",
        title: "Earn for 3 months",
        description:
          "You receive 25% of Naano's commission on its eligible campaigns.",
      },
    ],
  },

  simulator: {
    eyebrow: "REWARD SIMULATOR",
    title: "What could your network earn?",
    campaign: {
      label: "Monthly paid campaign volume per brand",
      min: 1000,
      max: 25000,
      defaultValue: 3000,
    },
    brands: {
      label: "Active referred brands",
      min: 1,
      max: 10,
      defaultValue: 2,
    },
    note: "Illustrative estimate using a 20% Naano commission. Your actual reward is always 25% of the commission Naano realizes on eligible campaigns.",
  },
} as const;

export const messagesPageData = {
  title: "Messages",
  searchPlaceholder: "Search conversations",
  conversations: [
    {
      id: "naano-bot",
      name: "NaanoBot",
      description: "A question or need help? Start here.",
      status: "Now",
    },
  ],
  emptyState:
    "No conversations yet - the thread opens with your first Booking.",
  assistant: {
    name: "Naano help center",
    status: "Instant assistant · team when needed",
    eyebrow: "YOUR NAANO SPACE",
    title: "How can we help?",
    description:
      "Product question, bug or performance concern: everything stays here and the team steps in when needed.",
    availability: "Available now",
    options: [
      {
        id: "performance",
        title: "Understand my performance",
        description: "Review your analytics",
      },
      {
        id: "product-help",
        title: "Get product help",
        description: "Get an instant answer",
      },
      {
        id: "bug",
        title: "Report a bug",
        description: "Escalated when needed",
      },
      {
        id: "idea",
        title: "Suggest an idea",
        description: "Share product feedback",
      },
    ],
    welcomeMessage:
      "Hi, I’m the Naano assistant. Ask me a question or choose an option above — the team can step in if needed.",
  },
  performance: {
    eyebrow: "PERFORMANCE SNAPSHOT",
    label: "Estimate",
    title: "Your profile is ready; views are still missing",
    description:
      "Naano can already help with your profile, but needs more post analytics for performance comparisons.",
    metric: "Median · 0",
  },
  requestStatus: {
    title: "Request status",
    status: "Assistant available",
    description: "A human takes over for sensitive requests.",
    sections: [
      {
        title: "Shared context",
        description:
          "Naano uses the active page and your account data — campaigns, bookings and analytics — without accessing other accounts.",
      },
      {
        title: "Important limitation",
        description:
          "A drop in views can have many causes. Recommendations are hypotheses to test, never a certain diagnosis.",
      },
    ],
  },
  inputPlaceholder: "Ask Naano a question...",
} as const;
