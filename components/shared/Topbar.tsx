"use client";
import {
  OrganizationSwitcher,
  SignedIn,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const Topbar = () => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items center gap-4">
        <Image
          src={"/assets/logo.svg"}
          alt="Logo of the app"
          width={28}
          height={28}
        />
        <p className="text-light-1 max-xs:hidden text-heading3-bold">Threads</p>
      </Link>
      <div className="flex items-center gap-1 ">
        <div className="block md:hidden">
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
                className="bg-dark-4 p-4 hover:bg-dark-3 ease-in-out duration-300 transition-colors"
              >
                <div className="flex cursor-pointer">
                  <Image
                    src={"/assets/logout.svg"}
                    alt="Log Out"
                    width={28}
                    height={28}
                  />
                </div>
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "px-4 py-2",
            },
          }}
        />
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};

export default Topbar;
