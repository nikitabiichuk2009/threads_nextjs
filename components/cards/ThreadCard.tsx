"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { likePost, savePost } from "@/lib/actions/user.action";
import { redirect, usePathname, useRouter } from "next/navigation";

interface ThreadCardProps {
  id: string;
  currentUserClerkId: string;
  content: string;
  author: {
    name: string;
    image: string;
    clerkId: string;
  };
  community: {
    name: string;
    id: string;
    image: string;
  };
  likes: number;
  createdAt: string;
  parentId?: string;
  comments: any[];
  isComment?: boolean;
  isSaved: boolean;
  isLiked: boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  currentUserClerkId,
  content,
  author,
  community,
  likes,
  createdAt,
  comments = [],
  isComment,
  isSaved,
  isLiked,
}) => {
  const { toast } = useToast();
  const pathName = usePathname();
  const router = useRouter();
  const copyLinkToThread = (threadId: string) => {
    const link = `${process.env.NEXT_PUBLIC_LINK}/thread/${threadId}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
          className: "bg-green-500 text-white border-none",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Error",
          description: "Failed to copy link.",
          className: "bg-red-500 text-white border-none",
        });
      });
  };
  const handleSavePost = async () => {
    if (!currentUserClerkId) {
      toast({
        title: "You need to log in to save a thread.",
        className: "bg-blue text-white border-none",
      });
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
      return;
    }
    try {
      await savePost(currentUserClerkId, id, `/thread/${id}`, isSaved);
      toast({
        title: "Success",
        description: `${
          !isSaved
            ? "Successfully saved a thread."
            : "Successfully unsaved a thread."
        }`,
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      console.error("Failed to save post: ", err);
      toast({
        title: "Error",
        description: "Failed to save post.",
        className: "bg-red-500 text-white border-none",
      });
    }
  };

  const handleLikePost = async () => {
    if (!currentUserClerkId) {
      toast({
        title: "You need to log in to like a thread.",
        className: "bg-blue text-white border-none",
      });
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
      return;
    }
    try {
      await likePost(currentUserClerkId, id, `/thread/${id}`, isLiked);
      toast({
        title: "Success",
        description: `${
          !isLiked
            ? "Successfully liked a thread."
            : "Successfully unliked a thread."
        }`,
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      console.error("Failed to save post: ", err);
      toast({
        title: "Error",
        description: "Failed to like a thread.",
        className: "bg-red-500 text-white border-none",
      });
    }
  };
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "p-7 bg-dark-2"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.clerkId}`}
              className="cursor-pointer"
            >
              <div className="relative size-8">
                <Image
                  src={author.image}
                  alt="profile image"
                  layout="fill"
                  className="rounded-full object-cover"
                />
              </div>
            </Link>
            <div className="thread-card_bar"></div>
          </div>
          <div className="flex w-full flex-col">
            <Link
              href={`/profile/${author.clerkId}`}
              className="cursor-pointer"
            >
              <h4 className="text-base1-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="flex flex-row gap-3.5 items-center justify-cente">
                  <div className="flex flex-row gap-1 mt-[1px]">
                    <p className="text-light-1">{likes}</p>
                    <Image
                      src={
                        isLiked
                          ? "/assets/heart-filled.svg"
                          : "/assets/heart-gray.svg"
                      }
                      alt="heart"
                      className="cursor-pointer object-contain"
                      width={24}
                      height={24}
                      onClick={handleLikePost}
                    />
                  </div>
                  {!isComment && (
                    <Image
                      src={
                        isSaved ? "/assets/star-filled.svg" : "/assets/star.svg"
                      }
                      alt="heart"
                      className="cursor-pointer object-contain mt-[5px]"
                      width={24}
                      height={24}
                      onClick={handleSavePost}
                    />
                  )}
                  <Link href={`/thread/${id}`}>
                    <Image
                      src={"/assets/reply.svg"}
                      alt="reply"
                      className="cursor-pointer object-contain"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Image
                    src={"/assets/repost.svg"}
                    alt="repost"
                    onClick={() => copyLinkToThread(id)}
                    className="cursor-pointer object-contain"
                    width={24}
                    height={24}
                  />
                </div>
                {!isComment && pathName !== `/thread/${id}` && (
                  <Link href={`/thread/${id}`}>
                    <Image
                      src={"/assets/view.svg"}
                      alt="view"
                      className="cursor-pointer object-contain"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments?.length}{" "}
                    {comments?.length === 1 ? "reply" : "replies"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
