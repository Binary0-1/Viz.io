import "./globals.css";
import { JsonProvider } from "@/components/contexts/JsonContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonProvider>{children}</JsonProvider>
      </body>
    </html>
  );
}
