"use client";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { sendRequest } from "@/lib/actions/community.action";

interface ProfileHeaderProps {
  accounClerkId: string;
  img: string;
  name: string;
  username: string;
  userIdView?: string;
  bio?: string;
  bioLink?: string;
  location?: string;
  joinedDate: string;
  type: string;
  creator?: string;
  usersEmail?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  accounClerkId,
  img,
  name,
  username,
  usersEmail,
  userIdView,
  bio,
  bioLink,
  creator,
  location,
  joinedDate,
  type,
}) => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const handleAskJoin = async () => {
    if (!usersEmail) {
      toast({
        title:
          "You need to log in to your account to request to join the community",
        className: "bg-blue border-none text-white",
      });
      return;
    }
    setIsSending(true);
    try {
      await sendRequest(usersEmail, creator!);
      toast({
        title: "Successfully sent a request to join",
        className: "bg-green-500 border-none text-white",
      });
      setIsSending(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to send a request to join",
        className: "bg-red-500 border-none text-white",
      });
      setIsSending(false);
    }
  };
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex items-center gap-6">
          <div className="relative size-32 md:size-40">
            <Image
              src={img}
              alt="profile image"
              layout="fill"
              className="rounded-full object-cover shadow-lg shadow-white"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading2-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        <SignedIn>
          {accounClerkId === userIdView && type === "User" && (
            <Link href={`/profile/${accounClerkId}/edit`}>
              <Button className="mt-8 md:mt-0 min-h-[46px] w-full md:w-auto md:min-w-[175px] bg-primary-500 font-semibold !text-light-1 shadow-md transition-colors duration-300 ease-out hover:bg-purple-500">
                Edit profile
              </Button>
            </Link>
          )}
        </SignedIn>
        {type !== "User" && creator !== usersEmail && (
          <Button
            onClick={handleAskJoin}
            disabled={isSending}
            className="mt-8 md:mt-0 min-h-[46px] w-full md:w-auto md:min-w-[175px] bg-primary-500 font-semibold !text-light-1 shadow-md transition-colors duration-300 ease-out hover:bg-purple-500"
          >
            Ask to join
          </Button>
        )}
      </div>
      <p className="mt-12 max-w-lg text-base-semibold sm:text-[26px] line-clamp-3 text-light-2">
        {type === "Community" ? "Created" : "Joined"} at: {joinedDate}
      </p>
      {bio && (
        <p className="mt-6 max-w-lg text-small-regular sm:text-base-regular line-clamp-3 sm:text-[18px] text-light-2">
          <span className="font-bold">Bio:</span> {bio}
        </p>
      )}
      {bioLink && (
        <p className="mt-6 max-w-lg text-small-regular sm:text-base-regular text-light-1 flex flex-row gap-1">
          <span className="font-bold">Portfolio Link:</span>
          <Link
            href={bioLink}
            className="text-primary-500 hover:text-purple-500 duration-200 ease-in-out transition-colors flex flex-row gap-1"
          >
            {bioLink}{" "}
            <Image src={"/assets/link.svg"} height={20} width={20} alt="link" />
          </Link>
        </p>
      )}
      {location && (
        <p className="mt-6 max-w-lg text-small-regular sm:text-base-regular text-light-2">
          <span className="font-bold">Location:</span> {location}
        </p>
      )}
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
