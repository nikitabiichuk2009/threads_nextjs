import { UserButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <>
      <h1 className="font-bold text-white">Home</h1>
      <UserButton afterSignOutUrl="/" />
    </>
  );
};

export default Home;
