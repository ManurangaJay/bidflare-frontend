import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import StoreProvider from "@/redux/StoreProvider";
import NotificationListener from "@/components/NotificationListener";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            <NotificationListener />
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
