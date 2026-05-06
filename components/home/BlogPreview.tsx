"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { MagneticButton } from "@/components/effects/MagneticButton";
import { blog } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const blogImages = [
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&q=80",
];

export function BlogPreview() {
  return (
    <Section
      eyebrow="Insights"
      title={blog.heading}
      subtitle="Practical reads on visas, applications, and life abroad."
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {blog.posts.map((post, i) => (
          <motion.div key={post.slug} variants={fadeUp}>
            <Link href={`/blog/${post.slug}`} className="group block h-full">
              <GlassCard 
                tilt 
                glow={i === 0 ? "cyan" : i === 1 ? "accent" : "none"}
                className="overflow-hidden h-full"
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={blogImages[i % blogImages.length]}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-surface-hover)] backdrop-blur-sm border border-[var(--color-border)] text-[var(--color-fg)]">
                      <Tag size={10} aria-hidden />
                      {post.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)] mb-3">
                    <Calendar size={12} aria-hidden />
                    {post.date}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-[var(--color-fg)] leading-snug line-clamp-2 group-hover:text-[var(--color-cyan)] transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-cyan)]">
                      Read article
                      <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        className="mt-12 text-center"
      >
        <MagneticButton href="/blog" variant="ghost" size="lg">
          View All Articles
          <ArrowRight size={16} aria-hidden />
        </MagneticButton>
      </motion.div>
    </Section>
  );
}
