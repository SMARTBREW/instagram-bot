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
          background: "#fafafa",
          borderTop: "1px solid #dbdbdb",
          padding: "16px 24px",
          textAlign: "center",
          fontSize: "12px",
          color: "#8e8e8e",
          marginTop: "auto",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link 
              href="/privacy-policy" 
              style={{ 
                color: "#8e8e8e", 
                textDecoration: "none",
                fontWeight: 400,
              }}
            >
              Privacy Policy
            </Link>
            <span style={{ margin: "0 8px", color: "#dbdbdb" }}>•</span>
            <Link 
              href="/terms-of-service" 
              style={{ 
                color: "#8e8e8e", 
                textDecoration: "none",
                fontWeight: 400,
              }}
            >
              Terms of Service
            </Link>
            <span style={{ margin: "0 8px", color: "#dbdbdb" }}>•</span>
            <span>Instagram Messages by SMARTBREW</span>
          </div>
        </footer>
      </body>
    </html>
  );
}


