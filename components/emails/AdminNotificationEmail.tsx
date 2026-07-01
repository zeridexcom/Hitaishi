import * as React from "react";

interface AdminNotificationEmailProps {
  leadType: string;
  name: string;
  email: string;
  details: Record<string, any>;
}

export function AdminNotificationEmail({ leadType, name, email, details }: AdminNotificationEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#fcfcfa", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "20px", padding: "35px", border: "1px solid #e5e8e3", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
        {/* Header */}
        <div style={{ marginBottom: "25px", borderBottom: "1px solid #f0f3ef", paddingBottom: "15px" }}>
          <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#2f7d5c", fontWeight: "bold" }}>Hitaishi Admin Alert</span>
          <h1 style={{ fontSize: "20px", margin: "5px 0 0 0", color: "#0c3b2e", fontWeight: "600" }}>New Lead Notification</h1>
        </div>

        {/* Info */}
        <p style={{ fontSize: "14px", lineHeight: "1.5", margin: "0 0 20px 0", color: "#3f4943" }}>
          A new <strong>{leadType}</strong> has been submitted. Here are the details:
        </p>

        {/* Lead Summary */}
        <div style={{ backgroundColor: "#f6f8f5", borderRadius: "12px", padding: "20px", marginBottom: "25px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: "600", color: "#2f7d5c", width: "150px" }}>Lead Type:</td>
                <td style={{ padding: "6px 0", color: "#181d1a" }}>{leadType}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: "600", color: "#2f7d5c" }}>Name:</td>
                <td style={{ padding: "6px 0", color: "#181d1a" }}>{name}</td>
              </tr>
              <tr>
                <td style={{ padding: "6px 0", fontWeight: "600", color: "#2f7d5c" }}>Email:</td>
                <td style={{ padding: "6px 0", color: "#181d1a" }}>{email}</td>
              </tr>
              {Object.entries(details).map(([key, val]) => {
                let displayVal = "";
                if (Array.isArray(val)) {
                  displayVal = val.join(", ");
                } else if (typeof val === "object" && val !== null) {
                  displayVal = JSON.stringify(val);
                } else {
                  displayVal = String(val ?? "");
                }
                
                // Format camelCase key into human-readable label
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());
                
                return (
                  <tr key={key}>
                    <td style={{ padding: "6px 0", fontWeight: "600", color: "#2f7d5c" }}>{label}:</td>
                    <td style={{ padding: "6px 0", color: "#181d1a" }}>{displayVal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://www.hitaishii.com/admin/leads"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", backgroundColor: "#0c3b2e", color: "#ffffff", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}
          >
            Go to Admin Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
export default AdminNotificationEmail;
