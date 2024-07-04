import React from "react";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";
import { getSavedPostsByUser, getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { stringifyObject } from "@/lib/utils";

const Collection = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  let savedThreads = [];
  let currentUser;

  try {
    const savedPostsResult = await getSavedPostsByUser(userId);
    const userResult = await getUserById(userId);
    savedThreads = savedPostsResult;
    currentUser = stringifyObject(userResult);
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading saved posts"
          description="Failed to load saved posts. Please try reloading the page, pressing the button, or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }

  return (
    <>
      <h1 className="head-text text-white text-left">Collection</h1>
      <section className="mt-9 flex flex-col gap-5">
        {savedThreads.length === 0 ? (
          <NoResults
            title="No saved posts found"
            description="You have no saved posts."
            buttonTitle="Explore posts"
            href="/"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {savedThreads.map((thread) => {
              const threadData = stringifyObject(thread);
              return (
                <ThreadCard
                  key={threadData._id}
                  id={threadData._id}
                  currentUserClerkId={userId ? userId : ""}
                  content={threadData.text}
                  author={threadData.author}
                  community={threadData.community}
                  createdAt={threadData.createdAt}
                  comments={threadData?.children}
                  isSaved={true}
                  likes={threadData.likes}
                  isLiked={
                    currentUser?.likedPosts
                      ? currentUser.likedPosts.includes(threadData._id)
                      : false
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Collection;
