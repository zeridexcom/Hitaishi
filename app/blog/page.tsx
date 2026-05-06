import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { FadeIn } from "@/components/motion/FadeIn";
import { Newsletter } from "@/components/home/Newsletter";
import { blogIndex } from "@/lib/content";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog | EduExpert",
  description:
    "Practical reads on visas, applications, and life abroad — written for students and families weighing the move.",
};

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow={blogIndex.hero.eyebrow}
        title={blogIndex.hero.title}
        description={blogIndex.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Blog" },
        ]}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Posts */}
            <div className="lg:col-span-8">
              <div className="grid gap-8 sm:grid-cols-2">
                {posts.map((p, i) => (
                  <FadeIn key={p.slug} delay={i * 0.04}>
                    <article className="group h-full rounded-2xl bg-white border border-[var(--color-border)] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-fg)] hover:shadow-[var(--shadow-lift)]">
                      <Link href={`/blog/${p.slug}`} className="flex h-full flex-col">
                        <PlaceholderImage
                          aspect="aspect-[16/10]"
                          label="Cover image"
                          ariaLabel={`Cover for ${p.title}`}
                          rounded={false}
                        />
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-3 text-xs text-neutral-500 uppercase tracking-widest">
                            <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] text-[var(--color-accent)] font-semibold">
                              {p.category}
                            </span>
                            <span>{p.date}</span>
                          </div>
                          <h2 className="mt-4 text-base md:text-lg font-semibold text-[var(--color-fg)] leading-snug">
                            {p.title}
                          </h2>
                          <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)]">
                            Read more
                            <ArrowRight
                              size={14}
                              aria-hidden
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </span>
                        </div>
                      </Link>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              <FadeIn className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-7">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Categories
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {blogIndex.categories.map((c) => (
                    <li key={c}>
                      {/* TODO(client): wire to real /blog/category/[slug] once CMS exists */}
                      <span className="flex items-center justify-between text-sm text-neutral-700 hover:text-[var(--color-fg)] cursor-default">
                        <span>{c}</span>
                        <ArrowRight size={12} aria-hidden className="text-neutral-400" />
                      </span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.05} className="rounded-2xl border border-[var(--color-border)] bg-white p-7">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Tags
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {blogIndex.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-neutral-700"
                    >
                      <Tag size={11} aria-hidden />
                      {t}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </aside>
          </div>
        </Container>
      </section>

      <Newsletter />
    </>
  );
}
