import * as React from "react";

interface SessionScheduledEmailProps {
  recipientName: string;
  partnerName: string; // student name if recipient is mentor, and vice versa
  isMentor: boolean;
  dateStr: string;     // e.g. "Monday, Oct 12"
  timeStr: string;     // e.g. "5:00 PM - 5:45 PM"
  joinLink: string;
}

export function SessionScheduledEmail({
  recipientName,
  partnerName,
  isMentor,
  dateStr,
  timeStr,
  joinLink,
}: SessionScheduledEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 16px 0", color: "#0b6445" }}>
          Session Confirmed! 🗓️
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Hi {recipientName}, your 1-on-1 mentorship session with <strong>{partnerName}</strong> is officially scheduled and confirmed.
        </p>

        {/* Details Card */}
        <div style={{ backgroundColor: "#f7faf5", borderRadius: "20px", padding: "24px", border: "1px solid #e0e8dc", marginBottom: "30px" }}>
          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Date</span>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#181d1a", marginTop: "4px" }}>{dateStr}</div>
          </div>
          <div style={{ marginBottom: "14px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Time (IST)</span>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#181d1a", marginTop: "4px" }}>{timeStr}</div>
          </div>
          <div>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Meeting Link</span>
            <div style={{ fontSize: "14px", color: "#2f7d5c", marginTop: "4px", fontWeight: "500" }}>
              <a href={joinLink} style={{ color: "#2f7d5c", textDecoration: "underline" }}>Click here to join call</a>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          {isMentor 
            ? "Please make sure to review the student's onboarding responses, mock scores, and strength indicators before the call starts."
            : "Please find a quiet room and prepare your syllabus trackers. Bring your doubts!"
          }
        </p>

        {/* CTA */}
        <div style={{ marginBottom: "30px" }}>
          <a
            href={joinLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
          >
            Join Mentorship Call →
          </a>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          Need to reschedule? Log in to your Hitaishi dashboard and edit slots at least 2 hours before the start.
        </div>
      </div>
    </div>
  );
}
export default SessionScheduledEmail;
