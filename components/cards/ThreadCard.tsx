"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useToast } from "../ui/use-toast";
import { likePost, savePost } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteThreadFromDB } from "@/lib/actions/thread.action";
import { formatDate } from "@/lib/utils";

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
  parentId,
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

  const deleteThread = async () => {
    if (!isComment) router.push("/");
    try {
      await deleteThreadFromDB(id, pathName);
      toast({
        title: "Success",
        description: `${
          !isComment
            ? "Successfully deleted a thread."
            : "Successfully deleted a comment."
        }`,
        className: "bg-green-500 text-white border-none",
      });
    } catch (err) {
      console.error("Failed to save post: ", err);
      toast({
        title: "Error",
        description: `Failed to delete a ${!isComment ? "thread" : "comment"}.`,
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
      {currentUserClerkId === author.clerkId && !isComment && (
        <div className="flex flex-row mb-4 md:mb-8 gap-3.5">
          <Link href={`/thread/${id}/edit`}>
            <Image
              src={"/assets/edit.svg"}
              alt="edit"
              width={20}
              height={20}
              className="cursor-pointer object-contain"
            />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger>
              <Image
                src={"/assets/delete.svg"}
                width={20}
                height={20}
                className="cursor-pointer object-contain"
                alt="delete"
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dark-2 border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-light-1">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-gray-1">
                  This action cannot be undone. This will permanently delete
                  your {isComment ? "comment" : "thread"}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mb-2 me-2 rounded-lg border-none px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-out hover:text-blue-700 focus:outline-none  bg-gray-800 text-gray-400  hover:bg-gray-700 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteThread}
                  className="bg-primary-500 px-4 py-3 font-semibold !text-light-1 shadow-md transition-colors duration-300 ease-out hover:bg-purple-500"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {!isComment && !parentId && community && (
        <div className="md:hidden mb-6">
          <Link
            href={`/community/${community.id}`}
            className="flex items-center gap-2"
          >
            <p className="text-subtle-medium sm:text-small-medium text-gray-1">
              {community.name} Community
            </p>
            <div className="relative size-8">
              <Image
                src={community.image}
                alt="community image"
                layout="fill"
                className="rounded-full object-cover"
              />
            </div>
          </Link>
        </div>
      )}
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
            <p className="mt-2 text-small-regular text-light-2 line-clamp-5">
              {content}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="flex flex-row gap-3.5 items-center justify-center">
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
                  {!isComment && !parentId && (
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
                {currentUserClerkId === author.clerkId && isComment && (
                  <div className="flex flex-row gap-3.5 items-center">
                    <Link href={`/thread/${id}/edit`}>
                      <Image
                        src={"/assets/edit.svg"}
                        alt="edit"
                        width={20}
                        height={20}
                        className="cursor-pointer object-contain"
                      />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Image
                          src={"/assets/delete.svg"}
                          width={20}
                          height={20}
                          className="cursor-pointer object-contain"
                          alt="delete"
                        />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-dark-2 border-none">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-light-1">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-gray-1">
                            This action cannot be undone. This will permanently
                            delete your {isComment ? "comment" : "thread"}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="mb-2 me-2 rounded-lg border-none px-5 py-2.5 text-sm font-medium transition-colors duration-300 ease-out hover:text-blue-700 focus:outline-none  bg-gray-800 text-gray-400  hover:bg-gray-700 hover:text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={deleteThread}
                            className="bg-primary-500 px-4 py-3 font-semibold !text-light-1 shadow-md transition-colors duration-300 ease-out hover:bg-purple-500"
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
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
              {comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium sm:text-small-medium text-gray-1">
                    {comments?.length}{" "}
                    {comments?.length === 1 ? "reply" : "replies"}
                  </p>
                </Link>
              )}
              <div className="flex flex-row items-center gap-2">
                <p className="text-subtle-medium sm:text-small-medium text-gray-1">
                  {formatDate(createdAt)}
                </p>

                {!isComment && !parentId && community && (
                  <div className="hidden md:block">
                    <Link
                      href={`/community/${community.id}`}
                      className="flex items-center gap-2"
                    >
                      <p className="text-subtle-medium sm:text-small-medium text-gray-1">
                        - {community.name} Community
                      </p>
                      <div className="relative size-8">
                        <Image
                          src={community.image}
                          alt="community image"
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
