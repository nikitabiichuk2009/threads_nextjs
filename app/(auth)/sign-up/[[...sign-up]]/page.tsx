"use client";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const SigUpPage = () => {
  return (
    <main className="flex-center flex min-h-screen w-full flex-col items-center justify-center">
      <SignUp forceRedirectUrl={"/"} />
    </main>
  );
};

export default SigUpPage;
