import ThreadCard from "@/components/cards/ThreadCard";
import NoResults from "@/components/shared/NoResults";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import { formatDate, stringifyObject } from "@/lib/utils";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import UserCard from "@/components/cards/UserCard";
import { communityTabs } from "@/constants";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";

const CommunityDetails = async ({ params }: { params: { id: string } }) => {
  let community;
  let currentUser;
  let formattedDate;
  const { userId } = auth();
  try {
    if (!userId) {
      currentUser = null;
    } else {
      const vieweingUser = await getUserById(userId);
      currentUser = stringifyObject(vieweingUser);
    }
    const communityDetails = await fetchCommunityDetails(params.id);
    community = stringifyObject(communityDetails);
    formattedDate = formatDate(community.createdAt);
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="text-light-1 head-text">Error</h1>
        <NoResults
          title="Error fetching community data"
          description="There was an error fetching the community data. Maybe the user you are looking for doesn't exist. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }
  return (
    <section>
      <ProfileHeader
        accounClerkId={community.id}
        img={community.image}
        name={community.name}
        username={community.username}
        joinedDate={formattedDate}
        creator={community.createdBy.email}
        usersEmail={currentUser.email ? currentUser.email : ""}
        type="Community"
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {community.threads.length}
                  </p>
                )}
                {tab.label === "Members" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {community.members.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent
            value="threads"
            className="w-full text-light-1 mt-9 flex flex-col gap-8"
          >
            {/* @ts-ignore */}
            {community.threads.map((threadData) => {
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
          </TabsContent>

          <TabsContent value="members" className="mt-9 w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              {community.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  clerkId={member.clerkId}
                  name={member.name}
                  username={member.username}
                  img={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default CommunityDetails;
