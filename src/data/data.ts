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
export const footerGroups = [
  {
    title: "Product",
    links: ["Features", "Pricing", "FAQs", "Blog", "Reports & benchmarks", "About"],
  },
  {
    title: "Company",
    links: ["Help Center", "Privacy", "Terms of Sale & Use"],
  },
  {
    title: "Press",
    links: ["Interview Thomas Marcelle, Xymag.tv", "Naano on FounderTrace", "Naano on TechnicalBeep"],
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

export const trustLogos = ["attio", "La Growth Machine", "goji berry", "ChatSEO", "Abyssale"];

export const marketplaceCreators = [
  { name: "Aymane Junior", specialty: "AI · SaaS", country: "Germany", score: "97/100", value: "€360", initials: "AJ", tone: "bg-sky-200" },
  { name: "Emma Guetta", specialty: "AI · Media / Content", country: "France", score: "96/100", value: "€480", initials: "EG", tone: "bg-violet-200" },
  { name: "Augustin Rudigoz", specialty: "Productivity · Fintech", country: "France", score: "92/100", value: "€960", initials: "AR", tone: "bg-amber-200" },
  { name: "Raghav Jerath", specialty: "Growth / GTM · Software", country: "France", score: "90/100", value: "€84", initials: "RJ", tone: "bg-emerald-200" },
  { name: "Daniel Meisen", specialty: "Growth / GTM · Agencies", country: "Germany", score: "89/100", value: "€120", initials: "DM", tone: "bg-rose-200" },
  { name: "Pierre Davadan", specialty: "SaaS · AI", country: "France", score: "89/100", value: "€84", initials: "PD", tone: "bg-indigo-200" },
];

export const workflowSteps = [
  { number: "01", title: "Find creators your buyers trust", icon: "users" },
  { number: "02", title: "Build a campaign brief in minutes", icon: "file" },
  { number: "03", title: "Manage every collaboration", icon: "clipboard" },
  { number: "04", title: "Track reach, clicks, and leads", icon: "chart" },
  { number: "05", title: "Pay creators without the admin", icon: "wallet" },
];

export const results = [
  { value: "5M+", label: "Impressions generated" },
  { value: "30K+", label: "Leads generated" },
  { value: "2,000+", label: "Creators on Naano" },
  { value: "5K+", label: "Posts published" },
];

export const pricingPlans = [
  {
    eyebrow: "Self-serve",
    title: "Run it yourself.",
    copy: "For teams that want the infrastructure to run creator campaigns in-house.",
    price: "€0",
    priceNote: "/ month",
    features: ["Creator marketplace access", "AI-powered brief creation", "Track clicks, companies and pipeline", "Automatic creator payouts"],
    action: "Start for free",
  },
  {
    eyebrow: "Managed campaigns",
    title: "Get your time back.",
    copy: "For teams that want Naano to operate their creator channel end to end.",
    price: "Custom quote",
    features: ["Campaign strategy and positioning", "Creator sourcing and coordination", "Brief creation and campaign launch", "Reporting and optimisation"],
    action: "Book a campaign call",
  },
];

export const faqs = [
  ["What is Naano?", "Naano is a B2B LinkedIn creator marketplace where teams discover and book vetted creators for sponsored campaigns, with every collaboration measured from reach to pipeline."],
  ["How does Naano find the right creators?", "We match creators on audience relevance, topic expertise, geography and the goals of your campaign."],
  ["Which networks do you support?", "Naano is built for B2B LinkedIn creator campaigns."],
  ["How does per-post pricing work?", "Each creator sets a clear, fixed price per post before you book."],
  ["How does attribution work?", "Campaign links and reporting connect engagement to clicks, qualified leads and pipeline."],
] as const;
