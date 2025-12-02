import "./globals.css";

export const metadata = {
  title: "Instagram DM Backend Demo",
  description: "Minimal demo UI for Meta App Review (instagram_manage_messages & instagram_basic)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </body>
    </html>
  );
}


