import React from "react";
import { fetchAllThreads } from "@/lib/actions/thread.action";
import NoResults from "@/components/shared/NoResults";
import { auth } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";
import { getUserById } from "@/lib/actions/user.action";
import { SearchParamsProps, stringifyObject } from "@/lib/utils";
import LocalSearchBar from "@/components/shared/LocalSearchBar";
import Pagination from "@/components/shared/Pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const searchQuery = searchParams ? searchParams.q : "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { userId } = auth();
  let allThreads;
  let isNextPage;
  let currentUser;
  try {
    const result = await fetchAllThreads({ searchQuery, pageNumber: page });
    if (!userId) {
      currentUser = null;
    } else {
      const userResult = await getUserById(userId);
      currentUser = stringifyObject(userResult);
    }
    allThreads = result.allThreads;
    isNextPage = result.isNextPage;
  } catch (err: any) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading posts or current logged user"
          description="Failed to load posts or current logged user. Please try reloading the page, pressing the button or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <>
      <h1 className="head-text text-white text-left mb-10">Home</h1>
      <Link
        href="/create-thread"
        className="flex justify-end max-sm:w-full mb-12"
      >
        <Button className="bg-primary-500 hover:bg-purple-500 ease-in-out duration-300 transition-colors min-h-[46px] px-4 py-3 font-semibold !text-light-1">
          Create a thread
        </Button>
      </Link>
      <LocalSearchBar
        searchFor="Search for threads"
        iconPosition="left"
        route="/"
        imgSrc="/assets/search.svg"
        otherClasses="flex-1"
      />
      <section className="mt-9 flex flex-col gap-10">
        {allThreads.length === 0 ? (
          <NoResults
            title="No posts found"
            description={
              searchQuery
                ? `No posts found matching your search "${searchQuery}". Try adjusting your search terms or explore other posts.`
                : "No posts have been found. Start exploring the community or create a new post."
            }
            buttonTitle="Create a post"
            href="/create-thread"
          />
        ) : (
          <div className="flex flex-col gap-8">
            {allThreads.map((thread) => {
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
                  parentId={threadData.parentId}
                  comments={threadData?.children}
                  isComment={false}
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
              );
            })}
          </div>
        )}
        <Pagination isNext={isNextPage} pageNumber={page} />
      </section>
    </>
  );
};

export default Home;
