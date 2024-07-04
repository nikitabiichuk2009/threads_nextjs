import React from "react";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";
import { getSavedPostsByUser, getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { SearchParamsProps, stringifyObject } from "@/lib/utils";
import LocalSearchBar from "@/components/shared/LocalSearchBar";

const Collection = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  const searchQuery = searchParams ? searchParams.q : "";

  if (!userId) {
    redirect("/sign-in");
  }

  let savedThreads = [];
  let currentUser;

  try {
    const savedPostsResult = await getSavedPostsByUser({
      userClerkId: userId,
      searchQuery,
    });
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
      <h1 className="head-text text-white text-left mb-10">Collection</h1>
      <LocalSearchBar
        searchFor="Search for saved posts"
        iconPosition="left"
        route="/"
        imgSrc="/assets/search.svg"
        otherClasses="flex-1"
      />
      <section className="mt-9 flex flex-col gap-8">
        {savedThreads.length === 0 ? (
          <NoResults
            title="No saved posts found"
            description={
              searchQuery
                ? `No saved posts found matching your search "${searchQuery}". Try adjusting your search terms or explore other posts.`
                : "You haven't saved any posts yet. Explore the latest threads and save your favorite posts for easy access later."
            }
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
