import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import NoResults from "@/components/shared/NoResults";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { getUserById } from "@/lib/actions/user.action";
import { stringifyObject } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const Thread = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const { userId } = auth();
  let currentUser;
  let threadData;
  try {
    const thread = await fetchThreadById(params.id);
    threadData = stringifyObject(thread);
    if (!userId) {
      currentUser = null;
    } else {
      const userResult = await getUserById(userId);
      currentUser = stringifyObject(userResult);
    }
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading current user or thread"
          description="Failed to recognize current user or loading a thread. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <section className="relative">
      {threadData.parentId && (
        <Link
          href={`/thread/${threadData.parentId}`}
          className="text-primary-500 underline hover:text-purple-500 transition-colors duration-200 ease-in-out text-heading4-medium"
        >
          Go back
        </Link>
      )}
      <div className={threadData.parentId && "mt-10"}>
        <ThreadCard
          key={threadData._id}
          id={threadData._id}
          currentUserClerkId={userId ? userId : ""}
          content={threadData.text}
          isComment={false}
          author={threadData.author}
          community={threadData.community}
          createdAt={threadData.createdAt}
          comments={threadData?.children}
          likes={threadData.likes}
          isSaved={
            currentUser?.savedPosts
              ? currentUser.savedPosts.includes(threadData._id)
              : false
          }
          isLiked={
            currentUser?.likedPosts
              ? currentUser.likedPosts.includes(threadData._id)
              : false
          }
        />
      </div>
      <div className="mt-9">
        <Comment
          threadId={threadData._id}
          currentUserImg={currentUser?.image || ""}
          currentUserId={currentUser?._id || ""}
        />
      </div>
      <div className="mt-10 flex flex-col gap-6">
        {threadData.children.map((childItem: any) => {
          return (
            <ThreadCard
              key={childItem._id}
              id={childItem._id}
              parentId={childItem.parentId}
              currentUserClerkId={userId ? userId : ""}
              content={childItem.text}
              author={childItem.author}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem?.children}
              isSaved={
                currentUser?.savedPosts
                  ? currentUser.savedPosts.includes(threadData._id)
                  : false
              }
              isComment={true}
              likes={childItem.likes}
              isLiked={
                currentUser?.likedPosts
                  ? currentUser.likedPosts.includes(childItem._id)
                  : false
              }
            />
          );
        })}
      </div>
    </section>
  );
};

export default Thread;
