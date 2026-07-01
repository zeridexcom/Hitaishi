import * as React from "react";

interface DoubtAssignedEmailProps {
  mentorName: string;
  studentName: string;
  subject: string;       // e.g. "Physics"
  topic: string;         // e.g. "Rotational Mechanics"
  doubtLink: string;
}

export function DoubtAssignedEmail({
  mentorName,
  studentName,
  subject,
  topic,
  doubtLink,
}: DoubtAssignedEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 16px 0", color: "#0b6445" }}>
          New Doubt Assigned! 📚
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Hi {mentorName}, your student <strong>{studentName}</strong> has posted a new doubt that requires your review.
        </p>

        {/* Details Card */}
        <div style={{ backgroundColor: "#f7faf5", borderRadius: "20px", padding: "24px", border: "1px solid #e0e8dc", marginBottom: "30px" }}>
          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Subject</span>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#181d1a", marginTop: "4px" }}>{subject}</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Topic</span>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#181d1a", marginTop: "4px" }}>{topic}</div>
          </div>
        </div>

        <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          Providing high-quality, step-by-step guidance is key to your student&apos;s progress. Please click below to view the doubt description and attach your explanation:
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "30px" }}>
          <a
            href={doubtLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
          >
            Answer Student Doubt →
          </a>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          Hitaishi Mentor Desk · Keeping doubts answered under 24 hours.
        </div>
      </div>
    </div>
  );
}
export default DoubtAssignedEmail;
