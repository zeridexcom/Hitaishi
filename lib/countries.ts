// Per-country detail data for /country/[slug].
// Universities are real (per eduexpert-rebuild.md §3 PAGE 4).
// Body copy & taglines are factual baseline content — TODO(client) verification before launch.

export type CountryDetail = {
  slug: string;
  name: string;
  code: string;
  flagEmoji: string;
  tagline: string;
  intro: string;
  whyStudy: string[];
  universities: string[];
};

export const countryDetails: CountryDetail[] = [
  {
    slug: "canada",
    name: "Canada",
    code: "CA",
    flagEmoji: "🇨🇦",
    tagline: "World-class research, post-study work, and a pathway to permanent residency.",
    intro:
      "Canada hosts more than half a million international students each year. Tuition is competitive against the US and the UK, public healthcare is accessible to study-permit holders in most provinces, and the post-graduation work permit lets graduates work for up to three years.",
    whyStudy: [
      "Globally ranked institutions with strong research output",
      "Up to 3-year Post-Graduation Work Permit (PGWP)",
      "Clear pathway from study permit to permanent residency",
      "Multicultural cities with a large Indian student community",
    ],
    universities: [
      "University of Toronto",
      "University of British Columbia",
      "University of Montreal",
      "University of Waterloo",
      "Queen's University",
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    code: "AU",
    flagEmoji: "🇦🇺",
    tagline: "Eight of the world's top 100 universities and post-study work rights up to 4 years.",
    intro:
      "Australia's Group of Eight universities consistently rank among the world's best. Subclass 500 student visas allow 48 hours of work per fortnight during term, and the Temporary Graduate visa (subclass 485) extends post-study stay rights significantly.",
    whyStudy: [
      "Group of Eight universities with strong global rankings",
      "Post-study work visa from 2 to 4 years depending on level",
      "Strong economy with employer demand in STEM, health, and trades",
      "English-speaking environment with clear visa pathways",
    ],
    universities: [
      "University of Melbourne",
      "Australian National University",
      "University of Sydney",
      "University of Queensland",
      "Monash University",
    ],
  },
  {
    slug: "germany",
    name: "Germany",
    code: "DE",
    flagEmoji: "🇩🇪",
    tagline: "Tuition-free public universities and a powerhouse engineering economy.",
    intro:
      "Most public universities in Germany charge no tuition fees, even for international students. Programmes in English are common at the master's level, and the 18-month post-study Job Seeker visa makes the transition into work straightforward for STEM graduates.",
    whyStudy: [
      "Tuition-free public universities at most levels",
      "Strong industry-university links — especially in engineering",
      "18-month post-study job-seeker visa",
      "Lower cost of living than the UK or US",
    ],
    universities: [
      "TU Munich",
      "LMU Munich",
      "Heidelberg University",
      "Humboldt University Berlin",
      "RWTH Aachen",
    ],
  },
  {
    slug: "france",
    name: "France",
    code: "FR",
    flagEmoji: "🇫🇷",
    tagline: "Affordable public universities, grandes écoles, and the heart of the EU.",
    intro:
      "France combines low public-university tuition with a uniquely strong system of grandes écoles for business and engineering. The APS (Autorisation Provisoire de Séjour) gives graduates 12 months to find work, extendable for those who do.",
    whyStudy: [
      "Low tuition at public universities; world-class grandes écoles",
      "12-month post-study job-search visa (APS)",
      "Many master's programmes taught in English",
      "Strategic location for travel across the EU",
    ],
    universities: [
      "Sorbonne University",
      "Sciences Po",
      "École Polytechnique",
      "University of Paris-Saclay",
      "HEC Paris",
    ],
  },
  {
    slug: "ireland",
    name: "Ireland",
    code: "IE",
    flagEmoji: "🇮🇪",
    tagline: "English-speaking, EU-based, with a 2-year stay-back for postgraduates.",
    intro:
      "Ireland is home to the European headquarters of many of the world's largest tech and pharma companies — Google, Meta, Pfizer, Apple. The Third Level Graduate Programme allows non-EU master's graduates to remain in Ireland for up to 24 months to find work.",
    whyStudy: [
      "English-speaking EU member with strong tech & pharma sector",
      "2-year post-study work permission for master's graduates",
      "High research output per capita",
      "Clear, well-documented student visa process",
    ],
    universities: [
      "Trinity College Dublin",
      "University College Dublin",
      "University College Cork",
      "NUI Galway",
      "Dublin City University",
    ],
  },
  {
    slug: "italy",
    name: "Italy",
    code: "IT",
    flagEmoji: "🇮🇹",
    tagline: "Europe's oldest universities and one of its most affordable study destinations.",
    intro:
      "Italy hosts the oldest university in continuous operation (Bologna, since 1088). Public-university tuition is income-linked and often very low, with many master's programmes available entirely in English in design, engineering, and the humanities.",
    whyStudy: [
      "Income-based, low public-university tuition",
      "Long-running tradition in design, architecture, and the arts",
      "Many English-taught master's programmes",
      "Schengen access to the rest of the EU",
    ],
    universities: [
      "University of Bologna",
      "Sapienza University Rome",
      "University of Milan",
      "Politecnico di Milano",
      "University of Florence",
    ],
  },
  {
    slug: "belgium",
    name: "Belgium",
    code: "BE",
    flagEmoji: "🇧🇪",
    tagline: "Home of the EU institutions and three of the world's top 200 universities.",
    intro:
      "Belgium combines moderate tuition with a central European location and three official languages — Dutch, French, and German. KU Leuven, founded in 1425, is among Europe's oldest and highest-ranked universities.",
    whyStudy: [
      "Moderate tuition with English-taught master's programmes",
      "Central EU location — minutes by train to Paris, London, Amsterdam",
      "Strong research funding through EU programmes",
      "Multilingual environment — useful for Europe-wide careers",
    ],
    universities: [
      "KU Leuven",
      "Ghent University",
      "Université Libre de Bruxelles",
      "University of Antwerp",
      "Vrije Universiteit Brussel",
    ],
  },
  {
    slug: "denmark",
    name: "Denmark",
    code: "DK",
    flagEmoji: "🇩🇰",
    tagline: "Innovation-led economy, high quality of life, and English-taught programmes.",
    intro:
      "Danish universities are research-intensive and routinely rank in the European top 50. Most master's programmes are taught in English, and graduates can apply for an Establishment Card to remain in Denmark for up to two years after completion.",
    whyStudy: [
      "Research-led universities with global rankings",
      "Most master's programmes taught in English",
      "Up to 3-year stay-back via the Establishment Card",
      "Consistently top-rated for quality of life",
    ],
    universities: [
      "University of Copenhagen",
      "Technical University of Denmark",
      "Aarhus University",
      "University of Southern Denmark",
    ],
  },
  {
    slug: "greece",
    name: "Greece",
    code: "GR",
    flagEmoji: "🇬🇷",
    tagline: "Affordable EU study with a growing range of English-taught programmes.",
    intro:
      "Greece has expanded its English-taught offering significantly in recent years, particularly in maritime studies, archaeology, and tourism management. Public-university tuition is among the lowest in the EU.",
    whyStudy: [
      "Among the lowest tuition fees in the EU",
      "Strengths in maritime, archaeology, and tourism studies",
      "Schengen residency benefits during studies",
      "Affordable cost of living vs. western Europe",
    ],
    universities: [
      "National & Kapodistrian University of Athens",
      "Aristotle University of Thessaloniki",
      "Athens Polytechnic",
    ],
  },
  {
    slug: "hungary",
    name: "Hungary",
    code: "HU",
    flagEmoji: "🇭🇺",
    tagline: "Strong medical schools and one of the most affordable EU destinations.",
    intro:
      "Hungary is best known internationally for its medical and dental programmes taught in English at long-established universities. Living costs are among the lowest in the EU, and Budapest is a popular city for international students.",
    whyStudy: [
      "Internationally recognised medical & dental degrees in English",
      "Among the lowest living costs in the EU",
      "Long history of welcoming international students",
      "Schengen access during studies",
    ],
    universities: [
      "Eötvös Loránd University (ELTE)",
      "Budapest University of Technology",
      "University of Debrecen",
      "Semmelweis University",
    ],
  },
  {
    slug: "iceland",
    name: "Iceland",
    code: "IS",
    flagEmoji: "🇮🇸",
    tagline: "Small cohorts, low tuition, and research strengths in earth & energy sciences.",
    intro:
      "Iceland's universities are small, with low student-to-staff ratios. Public-university tuition is very low — most fees are administrative — and research strengths include geothermal energy, glaciology, and sustainability.",
    whyStudy: [
      "Very low public-university tuition fees",
      "Research strengths in earth sciences and renewable energy",
      "Safe, English-friendly environment",
      "Small class sizes with close faculty access",
    ],
    universities: [
      "University of Iceland",
      "Reykjavik University",
      "Iceland University of the Arts",
    ],
  },
  {
    slug: "luxembourg",
    name: "Luxembourg",
    code: "LU",
    flagEmoji: "🇱🇺",
    tagline: "Multilingual, multinational, and built around a single world-class university.",
    intro:
      "The University of Luxembourg is the only major university in the country and was founded in 2003 — small, modern, and deeply international. Programmes typically require students to study across two or three languages, often including English, French, and German.",
    whyStudy: [
      "Highly international student body and faculty",
      "Mandatory study-abroad term in most programmes",
      "Strong finance, IT, and EU-law specialisations",
      "Among the highest median graduate salaries in Europe",
    ],
    universities: ["University of Luxembourg"],
  },
];

export function getCountry(slug: string) {
  return countryDetails.find((c) => c.slug === slug);
}
