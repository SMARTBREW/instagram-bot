import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Instagram DM",
  description: "Instagram DM UI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          backgroundColor: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <footer style={{
          background: "#f5cd4c",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          padding: "12px 24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#000000",
          marginTop: "auto",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link 
              href="/privacy-policy" 
              style={{ 
                color: "#000000", 
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              Privacy Policy
            </Link>
            <span style={{ margin: "0 8px" }}>•</span>
            <Link 
              href="/terms-of-service" 
              style={{ 
                color: "#000000", 
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              Terms of Service
            </Link>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>Instagram DM Automation by SMARTBREW</span>
          </div>
        </footer>
      </body>
    </html>
  );
}


