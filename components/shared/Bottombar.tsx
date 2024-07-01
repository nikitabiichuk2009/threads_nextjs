"use client";
import { sidebarLinks } from "@/constants";
import { SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Bottombar = () => {
  const pathName = usePathname();
  const { userId } = useAuth();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route ||
            (link.label !== "Home" && pathName.startsWith(link.route));
          const route =
            link.label === "Profile" ? `/profile/${userId}` : link.route;
          if (link.label === "Profile" && !userId) return null; // Conditionally render profile link
          return (
            <Link
              key={link.label}
              href={route}
              className={`bottombar_link ${
                isActive
                  ? "bg-primary-500"
                  : "hover:bg-dark-2 ease-in-out duration-300 transition-colors"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={28}
                height={28}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden line-clamp-1">
                {link.label}
              </p>
            </Link>
          );
        })}
        <SignedOut>
          <Link
            href="/sign-in"
            className="bottombar_link hover:bg-dark-2 ease-in-out duration-300 transition-colors"
          >
            <Image
              src="/assets/account.svg"
              alt="login"
              width={28}
              height={28}
            />
            <p className="text-light-1 text-subtle-medium max-sm:hidden line-clamp-1">
              Sign In
            </p>
          </Link>
          <Link
            href="/sign-up"
            className="bottombar_link hover:bg-dark-2 ease-in-out duration-300 transition-colors"
          >
            <Image
              src="/assets/sign-up.svg"
              alt="sign up"
              width={28}
              height={28}
            />
            <p className="text-light-1 text-subtle-medium max-sm:hidden line-clamp-1">
              Sign Up
            </p>
          </Link>
        </SignedOut>
      </div>
    </section>
  );
};

export default Bottombar;
