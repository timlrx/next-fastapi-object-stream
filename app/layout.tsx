import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import RouteSelector from "./RouteSelector";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-use-object.vercel.dev"),
  title: "Schema Generation Preview",
  description: "Experimental preview of schema generation with useObject hook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" richColors />
        <div className="flex flex-row justify-center pt-20 h-full min-h-dvh bg-white dark:bg-zinc-900">
          <div>
            <div className="flex flex-row justify-center p-4">
              <RouteSelector />
            </div>
            <div className="flex flex-col justify-between gap-4 h-[90%]">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
