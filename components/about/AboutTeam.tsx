"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { GlassCard } from "@/components/effects/GlassCard";
import { aboutPage } from "@/lib/content";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

const teamImages = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80",
];

const teamRoles = [
  "Senior Visa Consultant",
  "Education Advisor",
  "Immigration Expert",
  "Student Relations",
  "Documentation Lead",
  "Country Specialist",
  "Coaching Head",
  "Client Success",
];

export function AboutTeam() {
  return (
    <Section
      eyebrow="People"
      title="Our trusted immigration support team"
      subtitle="Advisors, counsellors, and case managers â€” the people who actually move your application forward."
      particles
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Array.from({ length: aboutPage.teamCount }).map((_, i) => (
          <motion.div key={i} variants={fadeUp}>
            <GlassCard 
              tilt 
              glow={i % 2 === 0 ? "cyan" : "accent"}
              className="overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={teamImages[i % teamImages.length]}
                  alt={`Team member ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
                
                <div 
                  aria-hidden
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[var(--color-cyan)] to-transparent opacity-20"
                />
              </div>
              
              <div className="p-5">
                <div className="text-lg font-semibold text-[var(--color-fg)]">
                  Team Member
                </div>
                <div className="mt-1 text-sm text-[var(--color-cyan)]">
                  {teamRoles[i % teamRoles.length]}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
