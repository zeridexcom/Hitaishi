// Blog posts. Titles are real per eduexpert-rebuild.md §5.
// All bodies are TODO(client) — the live site has identical copy-pasted text on every post.

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string; // human-readable; TODO(client) confirm publish dates
  readingTime: string;
  excerpt: string;
  body: string[];
};

const placeholderExcerpt =
  "[Excerpt pending from client. The live site has identical copy on every post — this needs unique, real content per article.]";

const placeholderBody = [
  "[Body content pending from client. This article needs original copy — the live site has the same paragraph repeated across every post, which we cannot ship.]",
  "Once the client provides the real text, each post will render here in 3–6 paragraphs of original analysis: what the topic is, why it matters for students, and what to do next.",
];

export const posts: Post[] = [
  {
    slug: "elevating-your-visa-application",
    title: "Elevating your visa application: navigating complexity",
    category: "Visa",
    date: "Coming soon",
    readingTime: "6 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "application-arsenal",
    title: "Application Arsenal: Your Essential Toolkit for a Successful Visa Application",
    category: "Guide",
    date: "Coming soon",
    readingTime: "8 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "comprehensive-study-abroad-guide",
    title: "Your Comprehensive Guide to Successfully Pursuing Study Abroad",
    category: "Student",
    date: "Coming soon",
    readingTime: "10 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "student-visa-consulting-transforms",
    title: "How Student Visa Consulting Transforms the Journey",
    category: "Consulting",
    date: "Coming soon",
    readingTime: "5 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "student-visa-consulting-lights-the-way",
    title: "How Student Visa Consulting Lights the Way",
    category: "Consulting",
    date: "Coming soon",
    readingTime: "5 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "road-to-higher-education",
    title: "Student Visa Consulting and the Road to Higher Education",
    category: "Student",
    date: "Coming soon",
    readingTime: "7 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "impact-of-visa-consulting",
    title: "The Impact of Student Visa Consulting on Study Abroad",
    category: "Student",
    date: "Coming soon",
    readingTime: "6 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "experience-the-world-without-breaking-the-bank",
    title: "How to Experience the World without Breaking the Bank",
    category: "Travel",
    date: "Coming soon",
    readingTime: "5 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "10-must-visit-hidden-gems",
    title: "10 Must-Visit Hidden Gems for Your Next Vacation",
    category: "Travel",
    date: "Coming soon",
    readingTime: "9 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
  {
    slug: "elevating-visa-application-complexity",
    title: "Elevating Visa Application Complexity with Expert Help",
    category: "Visa",
    date: "Coming soon",
    readingTime: "6 min read",
    excerpt: placeholderExcerpt,
    body: placeholderBody,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
