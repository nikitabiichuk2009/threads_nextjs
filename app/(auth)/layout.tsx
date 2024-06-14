import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Threads",
  description: "A Threads Applliation created by Nikita Biichuk",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      afterSignOutUrl={"/"}
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default Layout;
