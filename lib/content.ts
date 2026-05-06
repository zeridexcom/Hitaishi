// All home-page content lifted from eduexpert-rebuild.md.
// TODO(client) markers indicate copy/data still pending.

export const nav = [
  { label: "Home", href: "/" },
  { label: "Coaching", href: "/coaching" },
  { label: "Visa", href: "/visa" },
  { label: "About", href: "/about" },
  { label: "Country", href: "/country" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const hero = {
  eyebrow: "Study Abroad Consulting",
  heading: "Expert Guidance for a Seamless Study Abroad Journey",
  bullets: [
    "Personalized Consultation",
    "Visa & Documentation Assistance",
    "Cultural & Academic Support",
  ],
  primaryCta: { label: "Book Appointment", href: "/contact" },
  secondaryCta: { label: "Read Story", href: "/about" },
};

export const partners = {
  heading: "We're proud to work with our preferred partners",
  // TODO(client): real partner logos. 7 placeholders for now.
  count: 7,
};

export type VisaCard = {
  title: string;
  description: string;
  icon: "plane" | "briefcase" | "graduation" | "home" | "hardhat";
};

export const visaTypes = {
  heading: "Visa types and eligibility assessment",
  href: "/visa",
  cards: [
    {
      title: "Tourist Visa",
      description:
        "Visit new places to discover with a Tourist Visa. We deliver your documents quickly and guide you through every step.",
      icon: "plane",
    },
    {
      title: "Commercial Visa",
      description:
        "Developing your trade, setting up new sales channels. Your visa is ready when your next opportunity is.",
      icon: "briefcase",
    },
    {
      title: "Student Visa",
      description:
        "Embarking on a journey of higher education in a foreign country opens doors to growth, culture, and new careers.",
      icon: "graduation",
    },
    {
      title: "Residence Visa",
      description:
        "Expert guidance for a seamless immigration journey — from documents to settlement, we walk with you.",
      icon: "home",
    },
    {
      title: "Working Visa",
      description:
        "Get your visa now for new business and earning opportunities. We handle the paperwork; you focus on the role.",
      icon: "hardhat",
    },
  ] satisfies VisaCard[],
};

export const howItWorks = {
  heading: "Dependable and Trustworthy Visa & Immigration Guidance",
  subtext:
    "Our team of seasoned professionals understands the complexities of immigration laws and visa procedures.",
  steps: [
    {
      title: "Choose your visa type",
      body: "Determine the visa type that fits your travel purpose.",
    },
    {
      title: "Contact our branches",
      body: "Start your transaction by applying through our branches.",
    },
    {
      title: "Submit your documents",
      body: "Collect all the required documents for the process.",
    },
    {
      title: "Passport delivery",
      body: "Receive your visa, finalised after a successful application.",
    },
  ],
};

export const stats = {
  heading: "Discovering Our Biggest Successes",
  // TODO(client): real numbers. Showing "—" intentionally vs. lying with "00+".
  items: [
    { value: "—", label: "Visa Categories" },
    { value: "—", label: "Visa Process" },
    { value: "—", label: "Successful Projects" },
    { value: "—", label: "Pro Consultants" },
  ],
};

export type Country = { name: string; slug: string; code: string };

export const countries = {
  heading: "Make Your Choice for the Preferred Nation",
  subtext:
    "Choosing the ideal destination for immigration is a pivotal decision that can shape the trajectory of your life.",
  // TODO(client): confirm coverage per continent. Per .md only Europe is real for now.
  tabs: ["Europe", "North America", "Asia", "Latin America", "Oceania", "Africa", "Antarctica"],
  list: [
    { name: "Canada", slug: "canada", code: "CA" },
    { name: "Belgium", slug: "belgium", code: "BE" },
    { name: "Denmark", slug: "denmark", code: "DK" },
    { name: "Australia", slug: "australia", code: "AU" },
    { name: "France", slug: "france", code: "FR" },
    { name: "Germany", slug: "germany", code: "DE" },
    { name: "Greece", slug: "greece", code: "GR" },
    { name: "Hungary", slug: "hungary", code: "HU" },
    { name: "Iceland", slug: "iceland", code: "IS" },
    { name: "Ireland", slug: "ireland", code: "IE" },
    { name: "Italy", slug: "italy", code: "IT" },
    { name: "Luxembourg", slug: "luxembourg", code: "LU" },
  ] satisfies Country[],
};

export const team = {
  heading: "Our trusted immigration support team",
  // TODO(client): real names + photos + designations.
  placeholders: 4,
};

export const testimonials = {
  heading: "Happy Clients Reflect on Their Journey with Us",
  // TODO(client): real testimonials from real clients.
  placeholders: 2,
};

export const faq = {
  heading: "Common questions answered",
  items: [
    {
      q: "What services do you offer?",
      // TODO(client): real answer. See eduexpert-rebuild.md §3 home → FAQ.
      a: "We offer end-to-end study-abroad and visa consulting — country selection, university shortlisting, application support, visa documentation, and pre-departure orientation. [Detailed answer pending from client.]",
    },
    {
      q: "What is the consultation process like?",
      a: "Each consultation starts with a free profile review to understand your goals, academic background, and budget. From there we map a personalised plan. [Detailed answer pending from client.]",
    },
    {
      q: "How much do your services cost?",
      a: "Service fees vary by destination country and the level of support you need. We share transparent pricing during the first consultation. [Pricing details pending from client.]",
    },
    {
      q: "How do I get started with your services?",
      a: "Book a free appointment via our contact form or call us directly. One of our advisors will respond within one business day. [Confirm response SLA with client.]",
    },
    {
      q: "What is your success rate with visa applications?",
      a: "We maintain a high approval rate by ensuring every application is complete and well-documented before submission. [Exact success rate pending from client.]",
    },
  ],
};

export const blog = {
  heading: "Cast Your Eyes Upon Our Newest Article",
  // TODO(client): real blog content. Titles below are real per .md §5.
  posts: [
    {
      title: "Elevating your visa application: navigating complexity",
      slug: "elevating-your-visa-application",
      category: "Visa",
      date: "Coming soon",
    },
    {
      title: "Application Arsenal: Your Essential Toolkit for a Successful Visa Application",
      slug: "application-arsenal",
      category: "Guide",
      date: "Coming soon",
    },
    {
      title: "Your Comprehensive Guide to Successfully Pursuing Study Abroad",
      slug: "comprehensive-study-abroad-guide",
      category: "Student",
      date: "Coming soon",
    },
  ],
};

export const newsletter = {
  heading: "Subscribe to the free newsletter to receive the latest news & case studies!",
  placeholder: "you@email.com",
  cta: "Subscribe",
};

// ─── Visa page ────────────────────────────────────────────────────────────
// Per .md §3 PAGE 2 — the Visa page has 6 cards (adds Diplomatic Visa to the home set).
export const visaPage = {
  hero: {
    eyebrow: "Solutions",
    title: "Visa",
    description:
      "Every visa pathway, mapped clearly. Whether you're studying, working, settling, or visiting — we walk through the documentation, eligibility, and timelines with you.",
  },
  cards: [
    {
      title: "Tourist Visa",
      description:
        "Visit new places to discover with a Tourist Visa. We deliver your documents quickly and guide you through every step.",
      icon: "plane",
    },
    {
      title: "Commercial Visa",
      description:
        "Developing your trade, setting up new sales channels. Your visa is ready when your next opportunity is.",
      icon: "briefcase",
    },
    {
      title: "Diplomatic Visa",
      description:
        "For government officials, diplomats, and representatives of international organisations on official assignment.",
      icon: "shield",
    },
    {
      title: "Student Visa",
      description:
        "Embarking on a journey of higher education in a foreign country opens doors to growth, culture, and new careers.",
      icon: "graduation",
    },
    {
      title: "Residence Visa",
      description:
        "Expert guidance for a seamless immigration journey — from documents to settlement, we walk with you.",
      icon: "home",
    },
    {
      title: "Working Visa",
      description:
        "Get your visa now for new business and earning opportunities. We handle the paperwork; you focus on the role.",
      icon: "hardhat",
    },
  ] satisfies VisaCardExt[],
  whyUs: {
    heading: "Why choose EduExpert for your visa?",
    items: [
      {
        title: "Supportive environment",
        body: "Honest guidance from advisors who've helped families through every stage of the process.",
      },
      {
        title: "Student-friendly policies",
        body: "We surface the cheapest, fastest, and safest pathway for your specific profile.",
      },
      {
        title: "Quality at every step",
        body: "From SOPs to financial statements — every document is reviewed before submission.",
      },
      {
        title: "Opportunities for growth",
        body: "Beyond the visa: scholarship guidance, pre-departure orientation, and post-arrival support.",
      },
    ],
  },
};

export type VisaCardExt = {
  title: string;
  description: string;
  icon: "plane" | "briefcase" | "graduation" | "home" | "hardhat" | "shield";
};

// ─── About page ───────────────────────────────────────────────────────────
export const aboutPage = {
  hero: {
    eyebrow: "About",
    title: "Committed to Your Visa Success",
    description:
      "We deliver budget-friendly visa solutions, removing financial barriers from your journey. Our goal is to provide quality services at reasonable rates.",
  },
  mission: {
    eyebrow: "Mission",
    heading: "Guiding Your Path with Our Immigration Mission",
    body: "We're here to simplify immigration complexities, guiding you to success. Our mission is to unite families, open opportunities, and make your journey enriching. Your dreams are our focus on the path to a brighter future.",
  },
  history: {
    eyebrow: "Our story",
    heading: "Our Immigration Service history",
    body: "Our history began with a vision to make the immigration process smoother and more accessible for individuals and families around the world. With a deep understanding of the challenges that accompany moving to a new country, we built a practice rooted in honest advice, careful documentation, and genuine care for every applicant.",
    // TODO(client): real founding year, milestones, team origin story.
  },
  values: [
    {
      title: "Honesty first",
      body: "If a country isn't right for your profile, we'll say so — even if it loses us the case.",
    },
    {
      title: "Documentation rigour",
      body: "Every form, every translation, every cover letter — reviewed twice before it leaves our desk.",
    },
    {
      title: "Lifelong relationship",
      body: "From first call through arrival and beyond. We're still around when your renewal comes due.",
    },
  ],
  // About page lists 8 team placeholders per .md §3 PAGE 3.
  teamCount: 8,
};

// ─── Contact page ─────────────────────────────────────────────────────────
export const contactPage = {
  hero: {
    eyebrow: "Contact",
    title: "Let's plan your move",
    description:
      "Tell us about your goal — study, work, settle, or visit — and we'll come back within one business day with a clear next step.",
  },
  form: {
    heading: "Send a message",
    subtext: "Fill in the form and our team will reach out shortly.",
    fields: {
      name: "Full name",
      email: "Email address",
      phone: "Phone number",
      subject: "What can we help with?",
      message: "Tell us a little about your goal",
    },
    cta: "Send message",
  },
  // TODO(client): confirm if office is open to walk-ins by appointment only.
};

// ─── Coaching page ────────────────────────────────────────────────────────
// .md §3 PAGE 7: page is missing on the live site; full content needs client input.
// Building a sensible scaffold with TODO(client) markers for everything that's a guess.
export const coachingPage = {
  hero: {
    eyebrow: "Coaching",
    title: "Coaching for the tests that open the door",
    description:
      "IELTS, TOEFL, PTE, GRE, GMAT — the right score is often the difference between a shortlist and an offer. Our trainers focus on the skills that actually move scores.",
  },
  // TODO(client): confirm which tests EduExpert actually offers, batch types, faculty, fees.
  tests: [
    {
      title: "IELTS",
      description: "Academic & General Training. Speaking, Listening, Reading, Writing.",
      band: "Target band 7.0+",
    },
    {
      title: "TOEFL",
      description: "iBT format. Integrated speaking & writing practice with mock tests.",
      band: "Target score 100+",
    },
    {
      title: "PTE Academic",
      description: "Computer-based scoring. Pace and pronunciation drills tuned to PTE.",
      band: "Target score 65+",
    },
    {
      title: "GRE",
      description: "Quant, verbal, AWA. Timed sections with adaptive practice.",
      band: "Target score 320+",
    },
    {
      title: "GMAT",
      description: "Focus Edition. Quant, verbal, data insights — for MBA aspirants.",
      band: "Target score 700+",
    },
  ],
  features: [
    { title: "Certified trainers", body: "Trainers with verified test scores in the band they coach." },
    { title: "Doubt-solving sessions", body: "Daily one-on-one slots — never wait a week to clear a doubt." },
    { title: "Flexible batches", body: "Weekday, weekend, online, and one-on-one tracks." },
    { title: "Free study materials", body: "Section-wise workbooks and a graded mock test bank." },
  ],
  batches: [
    { name: "Regular weekday", schedule: "Mon – Fri · 90 mins/day", duration: "6 weeks" },
    { name: "Weekend track", schedule: "Sat & Sun · 3 hours/day", duration: "8 weeks" },
    { name: "Online live", schedule: "Daily · 90 mins · Zoom", duration: "6 weeks" },
    { name: "One-on-one", schedule: "Flexible · scheduled with trainer", duration: "Custom" },
  ],
  // TODO(client): real fee structure per test/batch.
};

// ─── Blog index sidebar (real per .md §5) ─────────────────────────────────
export const blogIndex = {
  hero: {
    eyebrow: "Insights",
    title: "Blog",
    description:
      "Practical reads on visas, applications, and life abroad — written for students and families weighing the move.",
  },
  categories: [
    "Blog",
    "Business visa",
    "Consulting",
    "Immigration",
    "Student",
    "Travel",
    "Visa quotas",
  ],
  tags: [
    "Abroad",
    "Family",
    "Government",
    "Immigration",
    "Student",
    "Travel",
    "Traveling",
    "Visa",
    "Work Visa",
  ],
};

// ─── Country index hero ───────────────────────────────────────────────────
export const countryIndex = {
  hero: {
    eyebrow: "Destinations",
    title: "Country",
    description:
      "Choosing the ideal destination is a pivotal decision. Browse the countries we cover — every page lists eligible institutes, why students pick that country, and what to expect.",
  },
};

export const footer = {
  explore: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Testimonials", href: "/#testimonials" },
  ],
  services: [
    { label: "Student Visa", href: "/visa" },
    { label: "Tourist Visa", href: "/visa" },
    { label: "Working Visa", href: "/visa" },
    { label: "Coaching", href: "/coaching" },
    { label: "Book Appointment", href: "/contact" },
  ],
  // TODO(client): confirm if more branches exist.
  branches: ["Electronic City, Bengaluru"],
};
