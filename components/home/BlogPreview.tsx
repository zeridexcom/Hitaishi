"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { blog } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const blogImages = ["/images/blog_thumbnail.png"];

export function BlogPreview() {
  const t = useTranslations("blog");
  const posts = t.raw("posts") as { title: string; category: string }[];

  return (
    <Section
      eyebrow="Insights"
      title={t("heading")}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {blog.posts.map((post, i) => {
          const translated = posts[i] ?? { title: "", category: "" };
          return (
            <motion.div key={post.slug} variants={fadeUp}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <GlassCard
                  tilt
                  glow={i === 0 ? "cyan" : i === 1 ? "accent" : "none"}
                  className="overflow-hidden h-full"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={blogImages[i % blogImages.length]}
                      alt={translated.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-surface-hover)] backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-fg)]">
                        <Tag size={10} aria-hidden />
                        {translated.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-3">
                      <Calendar size={12} aria-hidden />
                      {t("comingSoon")}
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--color-fg)] leading-snug line-clamp-2 group-hover:text-[var(--color-cyan)] transition-colors">
                      {translated.title}
                    </h3>

                    <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)]">
                        {t("readMore")}
                        <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        className="mt-12 text-center"
      >
        <MagneticButton href="/blog" variant="ghost" size="lg">
          {t("readMore")}
          <ArrowRight size={16} aria-hidden className="rtl:rotate-180" />
        </MagneticButton>
      </motion.div>
    </Section>
  );
}
