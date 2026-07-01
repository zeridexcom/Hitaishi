import * as React from "react";

interface WeeklyDigestEmailProps {
  studentName: string;
  mentorName: string;
  completedTasks: number;
  totalTasks: number;
  attendanceRate: string;   // e.g. "100%"
  latestMockScore: string;   // e.g. "185 / 300"
  mentorFeedback: string;
}

export function WeeklyDigestEmail({
  studentName,
  mentorName,
  completedTasks,
  totalTasks,
  attendanceRate,
  latestMockScore,
  mentorFeedback,
}: WeeklyDigestEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 16px 0", color: "#0b6445" }}>
          Your Weekly Progress Digest 📊
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Hello {studentName}, here is your weekly summary report from your Hitaishi mentor, <strong>{mentorName}</strong>:
        </p>

        {/* Progress Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "#f7faf5", border: "1px solid #e0e8dc", borderRadius: "16px", padding: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase" }}>Syllabus Tasks</span>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#181d1a", marginTop: "4px" }}>{completedTasks} / {totalTasks}</div>
          </div>
          <div style={{ backgroundColor: "#f7faf5", border: "1px solid #e0e8dc", borderRadius: "16px", padding: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase" }}>Attendance Rate</span>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#181d1a", marginTop: "4px" }}>{attendanceRate}</div>
          </div>
          <div style={{ backgroundColor: "#f7faf5", border: "1px solid #e0e8dc", borderRadius: "16px", padding: "16px", gridColumn: "span 2" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase" }}>Latest Mock Test</span>
            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#181d1a", marginTop: "4px" }}>{latestMockScore}</div>
          </div>
        </div>

        {/* Mentor feedback section */}
        <div style={{ borderLeft: "4px solid #2f7d5c", paddingLeft: "16px", margin: "0 0 30px 0" }}>
          <span style={{ fontSize: "11px", fontWeight: "bold", color: "#6f7a72", textTransform: "uppercase", letterSpacing: "1px" }}>Mentor Remarks</span>
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", lineHeight: "1.6", fontStyle: "italic", color: "#3f4943" }}>
            &ldquo;{mentorFeedback}&rdquo;
          </p>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          Hitaishi Mentorship Portal · Transparent progress summaries shared weekly with students and parents.
        </div>
      </div>
    </div>
  );
}
export default WeeklyDigestEmail;
