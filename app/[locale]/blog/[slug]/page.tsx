import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { Newsletter } from "@/components/home/Newsletter";
import { posts, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found | EduExpert" };
  return { title: `${post.title} | EduExpert Blog` };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const tNav = await getTranslations("nav");

  const post = getPost(slug);
  if (!post) notFound();

  const idx = posts.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <>
      <article>
        {/* Header */}
        <section className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
          <Container>
            <FadeIn className="py-16 md:py-24 max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-[var(--color-fg)] mb-8"
              >
                <ArrowLeft size={12} aria-hidden className="rtl:rotate-180" /> {tNav("blog")}
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-1 text-[10px] text-[var(--color-accent)] font-semibold">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} aria-hidden /> {t("comingSoon")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} aria-hidden /> {post.readingTime}
                </span>
              </div>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-fg)] leading-[1.1]">
                {post.title}
              </h1>
              <p className="mt-6 text-base md:text-lg text-neutral-600 leading-relaxed">
                {t("comingSoon")}
              </p>
            </FadeIn>
          </Container>
        </section>

        {/* Cover */}
        <section className="-mt-8 md:-mt-12 relative z-10">
          <Container>
            <FadeIn>
              <img
                src="/images/blog_cover.png"
                alt={`Cover image for ${post.title}`}
                className="aspect-[16/9] w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
              />
            </FadeIn>
          </Container>
        </section>

        {/* Body */}
        <section className="py-16 md:py-24">
          <Container>
            <FadeIn className="mx-auto max-w-3xl">
              <div className="prose-content flex flex-col gap-6 text-base md:text-lg text-neutral-700 leading-relaxed">
                {/* TODO(client): real article body — every post on the live site shares identical copy. */}
                {post.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* Prev / Next */}
        <section className="py-12 md:py-16 border-t border-[var(--color-border)]">
          <Container>
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all duration-200 hover:border-[var(--color-fg)] hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="text-xs uppercase tracking-widest text-neutral-500 inline-flex items-center gap-1.5">
                    <ArrowLeft size={12} aria-hidden className="rtl:rotate-180" />
                  </div>
                  <div className="mt-3 text-base font-medium text-[var(--color-fg)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group rounded-2xl border border-[var(--color-border)] bg-white p-6 md:text-right transition-all duration-200 hover:border-[var(--color-fg)] hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="text-xs uppercase tracking-widest text-neutral-500 inline-flex items-center gap-1.5 md:flex-row-reverse">
                    <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
                  </div>
                  <div className="mt-3 text-base font-medium text-[var(--color-fg)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </Container>
        </section>
      </article>

      <Newsletter />
    </>
  );
}
