"use client";
import { SignIn } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  return (
    <main className="flex-center flex min-h-screen w-full flex-col items-center justify-center">
      <SignIn forceRedirectUrl={"/"} />
    </main>
  );
};

export default SignInPage;
