import { Geist } from "next/font/google";
import "./globals.css";

const font = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShareTrip Icons",
  icons: {
    icon: "/favicon.svg",
  },
  image: {
    src: "/metaImg.jpg",
    alt: "ShareTrip Meta Image",
  },
  description:
    "Bangladesh's leading online travel agency. Book air tickets, hotels, tour packages & more without any hassle at the most affordable rates with ShareTrip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
