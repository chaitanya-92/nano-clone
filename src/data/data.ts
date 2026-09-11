export const siteConfig = {
  name: "naano",
  tagline: "Turn LinkedIn creators into your best acquisition channel.",
};

export const navItems = [
  {
    label: "For companies",
    href: "#companies",
  },
  {
    label: "For creators",
    href: "#creators",
  },
  {
    label: "For agencies",
    href: "#agencies",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
];

export const resourceLinks = [
  {
    label: "Blog",
    href: "#blog",
  },
  {
    label: "Customer stories",
    href: "#customer-stories",
  },
  {
    label: "Resources",
    href: "#resources",
  },
];

export const navigationActions = {
  language: {
    label: "EN",
    href: "#language",
    ariaLabel: "Change language",
  },

  resources: {
    label: "Resources",
    href: "#resources",
  },

  signIn: {
    label: "Sign in",
    href: "#sign-in",
  },

  signUp: {
    label: "Sign up",
    href: "#sign-up",
  },

  mobileMenu: {
    label: "Open navigation menu",
    closeLabel: "Close navigation menu",
  },
};

export const featuredTestimonial = {
  company: {
    name: "Zmirov Communication",
    logo: "/src/assets/logos/zmirov-communication.png",
  },

  quote: {
    before:
      "We manage €10M+ of influence budget every year. For B2B, Naano simply makes our life",
    highlight: "easier",
    closingQuote: '"',
  },

  person: {
    name: "David Zmirov",
    role: "CEO, Zmirov Communication",
    category: "Influence agency",
    image: "/src/assets/testimonials/david-zmirov.png",
  },
};

export const marketplaceSection = {
  eyebrow: "The Naano creator marketplace",

  title: "Work with all the best creators.",

  description:
    "Find the right B2B voices, compare their audience fit, and book every collaboration from one place.",

  image: "/src/assets/images/marketplace.png",

  imageAlt: "Naano creator marketplace",
};

export const footerGroups = [
  {
    title: "Product",
    links: [
      "Features",
      "Pricing",
      "FAQs",
      "Blog",
      "Reports & benchmarks",
      "About",
    ],
  },

  {
    title: "Company",
    links: [
      "Help Center",
      "Privacy",
      "Terms of Sale & Use",
    ],
  },

  {
    title: "Press",
    links: [
      "Interview Thomas Marcelle, Xymag.tv",
      "Naano on FounderTrace",
      "Naano on TechnicalBeep",
    ],
  },

  {
    title: "Resources",
    links: [
      "LinkedIn creator marketplace",
      "B2B influencer marketing cost",
      "Creator Marketplace explained",
      "Naano vs alternatives",
      "Creator-led growth for B2B",
      "LinkedIn Ads vs creator-led CPL",
    ],
  },
];

export const trustLogos = [
  "attio",
  "La Growth Machine",
  "goji berry",
  "ChatSEO",
  "Abyssale",
];

export const workflowSteps = [
  {
    number: "01",
    title: "Find creators your buyers trust",
    visual: {
      type: "creators",
      creators: [
        {
          name: "Eric",
          fit: "92%",
          image: "/src/assets/images/workflowimages/eric.png",
        },
        {
          name: "Robin",
          fit: "88%",
          image: "/src/assets/images/workflowimages/robin.png",
        },
        {
          name: "Aya",
          fit: "84%",
          image: "/src/assets/images/workflowimages/aya.png",
        },
      ],
    },
  },

  {
    number: "02",
    title: "Build a campaign brief in minutes",
    visual: {
      type: "brief",
      badge: "AI",
      items: [
        "Objectives and key messages",
        "Creator guidelines",
        "Tracking links ready",
      ],
      progress: 72,
    },
  },

  {
    number: "03",
    title: "Manage every collaboration",
    visual: {
      type: "collaboration",
      creators: [
        {
          name: "Raphael",
          status: "Draft ready",
          image: "/src/assets/images/workflowimages/raphael.png",
        },
        {
          name: "Thomas",
          status: "Scheduled",
          image: "/src/assets/images/workflowimages/thomas.png",
        },
        {
          name: "Nada",
          status: "Live",
          image: "/src/assets/images/workflowimages/nada.png",
        },
      ],
    },
  },

  {
    number: "04",
    title: "Track reach, clicks, and leads",
    visual: {
      type: "results",
      label: "Attributed pipeline",
      value: "€48.2K",
      change: "+24%",
      views: "124K views",
      leads: "418 leads",
      bars: [30, 42, 35, 55, 70, 88, 100],
    },
  },

  {
    number: "05",
    title: "Pay creators without the admin",
    visual: {
      type: "payment",
      title: "Payment scheduled",
      subtitle: "Handled by Naano",
      payoutLabel: "Creator payout",
      payout: "€1,240",
      actions: ["Contract", "Invoice", "Payout"],
    },
  },
] as const;

export const workflowSection = {
  eyebrow: "One platform, from brief to results",

  title: "Run creator campaigns from one place.",

  description:
    "Find the right voices, launch faster, and connect every post to measurable business results.",
};

export const results = [
  {
    value: "5M+",
    label: "Impressions generated",
  },

  {
    value: "30K+",
    label: "Leads generated",
  },

  {
    value: "2,000+",
    label: "Creators on Naano",
  },

  {
    value: "5K+",
    label: "Posts published",
  },
];

export const pricingPlans = [
  {
    eyebrow: "Self-serve",

    title: "Run it yourself.",

    copy:
      "For teams that want the infrastructure to run creator campaigns in-house.",

    price: "€0",

    priceNote: "/ month",

    features: [
      "Creator marketplace access",
      "AI-powered brief creation",
      "Track clicks, companies and pipeline",
      "Automatic creator payouts",
    ],

    action: "Start for free",
  },

  {
    eyebrow: "Managed campaigns",

    title: "Get your time back.",

    copy:
      "For teams that want Naano to operate their creator channel end to end.",

    price: "Custom quote",

    features: [
      "Campaign strategy and positioning",
      "Creator sourcing and coordination",
      "Brief creation and campaign launch",
      "Reporting and optimisation",
    ],

    action: "Book a campaign call",
  },
];

export const faqs = [
  [
    "What is Naano?",
    "Naano is a B2B LinkedIn creator marketplace where teams discover and book vetted creators for sponsored campaigns, with every collaboration measured from reach to pipeline.",
  ],

  [
    "How does Naano find the right creators?",
    "We match creators on audience relevance, topic expertise, geography and the goals of your campaign.",
  ],

  [
    "Which networks do you support?",
    "Naano is built for B2B LinkedIn creator campaigns.",
  ],

  [
    "How does per-post pricing work?",
    "Each creator sets a clear, fixed price per post before you book.",
  ],

  [
    "How does attribution work?",
    "Campaign links and reporting connect engagement to clicks, qualified leads and pipeline.",
  ],
] as const;