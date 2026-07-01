import * as React from "react";

interface MentorWelcomeEmailProps {
  fullName: string;
  onboardingLink: string;
}

export function MentorWelcomeEmail({ fullName, onboardingLink }: MentorWelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 20px 0", color: "#0b6445" }}>
          Welcome, {fullName}!
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Thank you for applying to become a Hitaishi mentor! You worked hard to get into IIT, and now you have the opportunity to share your journey and guide the next generation of JEE aspirants.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          To complete your profile setup and verify your institutional credentials, please check out the onboarding portal:
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "30px" }}>
          <a
            href={onboardingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
          >
            Access Onboarding Portal →
          </a>
        </div>

        <p style={{ fontSize: "13px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#6f7a72" }}>
          If the button doesn&apos;t work, copy and paste this URL into your browser:<br />
          <a href={onboardingLink} style={{ color: "#2f7d5c", wordBreak: "break-all" }}>{onboardingLink}</a>
        </p>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          You are receiving this because you submitted a mentor application on Hitaishi.<br />
          Hitaishi Mentorship · IIT Bombay & IIT Delhi alumni network.
        </div>
      </div>
    </div>
  );
}
export default MentorWelcomeEmail;
