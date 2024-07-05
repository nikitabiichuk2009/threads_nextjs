"use client";
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/clerk-react";
import { SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const LeftSidebar = () => {
  const pathName = usePathname();
  const { userId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
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
              className={`leftsidebar_link ${
                isActive
                  ? "bg-primary-500"
                  : "hover:bg-dark-3 ease-in-out duration-300 transition-colors"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={28}
                height={28}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <div className="flex flex-col gap-3">
          <SignedOut>
            <Link href="/sign-in">
              <Button className="duration-300 ease-in-out transition-colors bg-[#212734] hover:bg-dark-3 min-h-[41px] rounded-lg shadow-none w-full">
                <div className="flex cursor-pointer gap-4 lg:p-4 text-center items-center justify-center">
                  <Image
                    src="/assets/account.svg"
                    alt="login"
                    width={28}
                    height={28}
                  />
                  <p className="text-light-2 max-lg:hidden h3-bold">Sign In</p>
                </div>
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="duration-300 ease-in-out transition-colors bg-[#151821] w-full hover:bg-black min-h-[41px] rounded-lg shadow-none">
                <div className="flex cursor-pointer gap-4 lg:p-4 text-center items-center justify-center">
                  <Image
                    src="/assets/sign-up.svg"
                    alt="sign up"
                    width={28}
                    height={28}
                  />
                  <p className="text-light-2 max-lg:hidden h3-bold">Sign Up</p>
                </div>
              </Button>
            </Link>
          </SignedOut>
        </div>
        <SignedIn>
          <SignOutButton>
            <Button
              onClick={() => {
                router.push("/");
                toast({
                  title: "Successfully logged out.",
                  className: "bg-green-500 border-none text-white",
                });
                return;
              }}
              className="duration-300 ease-in-out transition-colors bg-[#151821] hover:bg-black min-h-[41px] rounded-lg shadow-none w-full"
            >
              <div className="flex cursor-pointer gap-4 lg:p-4 text-center items-center justify-center">
                <Image
                  src={"/assets/logout.svg"}
                  alt="Log Out"
                  width={28}
                  height={28}
                />
                <p className="text-light-2 max-lg:hidden h3-bold">Log Out</p>
              </div>
            </Button>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
