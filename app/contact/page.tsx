import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactMap } from "@/components/contact/ContactMap";
import { contactPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | EduExpert",
  description:
    "Talk to EduExpert about your study-abroad or visa plan. Call, email, or send us a message — we respond within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={contactPage.hero.eyebrow}
        title={contactPage.hero.title}
        description={contactPage.hero.description}
        crumbs={[
          { label: "EduExpert", href: "/" },
          { label: "Contact" },
        ]}
      />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </>
  );
}
