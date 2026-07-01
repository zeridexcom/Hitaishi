import * as React from "react";

interface InstitutionPartnerEmailProps {
  contactName: string;
  schoolName: string;
  onboardingLink: string;
}

export function InstitutionPartnerEmail({
  contactName,
  schoolName,
  onboardingLink,
}: InstitutionPartnerEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 20px 0", color: "#0b6445" }}>
          Partner Onboarding Setup 🏫
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Dear {contactName}, we are excited to partner with <strong>{schoolName}</strong> to deliver premium, data-driven JEE mentorship to your students.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          To unlock your institutional dashboard, configure class lists, and start tracking your student mentorship metrics, please complete the institutional onboarding setup:
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "30px" }}>
          <a
            href={onboardingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
          >
            Access Partner Portal →
          </a>
        </div>

        <p style={{ fontSize: "13px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#6f7a72" }}>
          If you have any questions or need to schedule an administrator briefing session, simply reply directly to this email or contact school-help@hitaishi.in.
        </p>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          Hitaishi for Institutions · School partner board.
        </div>
      </div>
    </div>
  );
}
export default InstitutionPartnerEmail;
