import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ai Chat Aug 2024",
  description: "An AI Chatbot App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="An AI Chatbot App" />
        <meta name="keywords" content="AI, chatbot, AI assistant, chat, OpenAI" />
        <meta name="author" content="Your Name" />

        {/* Open Graph Meta Tags for Social Sharing */}
        <meta property="og:title" content="Ai Chat Aug 2024" />
        <meta property="og:description" content="An AI Chatbot App" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-site.com" />
        <meta property="og:image" content="/path-to-your-preview-image.png" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ai Chat Aug 2024" />
        <meta name="twitter:description" content="An AI Chatbot App" />
        <meta name="twitter:image" content="/path-to-your-twitter-image.png" />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
