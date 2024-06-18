"use client";
import { SignUp } from "@clerk/nextjs";
import React from "react";
import { useRouter } from "next/navigation";

const SigUpPage = () => {
  const router = useRouter();
  return (
    <main className="flex-center flex min-h-screen w-full flex-col items-center justify-center">
      <SignUp forceRedirectUrl={"/onboarding"} />
    </main>
  );
};

export default SigUpPage;
