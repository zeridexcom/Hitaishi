import * as React from "react";

interface OnboardingMatchEmailProps {
  studentName: string;
  mentorName: string;
  mentorIIT: string;
  mentorBranch: string;
  bookingLink: string;
}

export function OnboardingMatchEmail({
  studentName,
  mentorName,
  mentorIIT,
  mentorBranch,
  bookingLink,
}: OnboardingMatchEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 20px 0", color: "#0b6445" }}>
          You&apos;ve been matched! 🎯
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Hi {studentName}, based on your onboarding answers and prep goals, we have matched you with your dedicated IITian mentor:
        </p>

        {/* Mentor Profile Card */}
        <div style={{ backgroundColor: "#f7faf5", borderRadius: "20px", padding: "24px", border: "1px solid #e0e8dc", marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#d9ebe2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", color: "#2f7d5c" }}>
              {mentorName.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600", color: "#181d1a" }}>{mentorName}</h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#6f7a72" }}>{mentorBranch} at {mentorIIT}</p>
            </div>
          </div>
          <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#3f4943" }}>
            {mentorName} cleared JEE Advanced with top honors and is ready to work with you on concept gaps, mock exam review, and weekly schedules.
          </p>
        </div>

        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          Please book your 1-on-1 introductory call to align your targets and get your milestone planner set up:
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "30px" }}>
          <a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
          >
            Book Intro Session →
          </a>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          Hitaishi Mentorship · Customized prep guides.
        </div>
      </div>
    </div>
  );
}
export default OnboardingMatchEmail;
