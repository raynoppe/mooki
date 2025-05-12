import Script from "next/script";
import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" &&
          process.env.PINY_VISUAL_SELECT === "true" && (
            <Script src="/_piny/piny.phone.js" strategy="beforeInteractive" />
          )}
      </body>
    </html>
  );
}
