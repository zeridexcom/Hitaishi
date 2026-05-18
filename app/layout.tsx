import "./globals.css";

export const metadata = {
  title: "MentorIIT",
  description: "Private mentorship for JEE/IIT aspirants",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
