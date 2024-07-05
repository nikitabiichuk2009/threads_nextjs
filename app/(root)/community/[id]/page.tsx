import ThreadCard from "@/components/cards/ThreadCard";
import NoResults from "@/components/shared/NoResults";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { getPostsByUser, getUserById } from "@/lib/actions/user.action";
import { formatDate, stringifyObject } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  let user;
  let currentUser;
  let userPosts;
  let formattedDate;
  const { userId } = auth();
  try {
    if (userId) {
      const userViewing = await getUserById(userId);
      currentUser = stringifyObject(userViewing);
    } else {
      currentUser = null;
    }
    const viewedUser = await getUserById(params.id);
    user = stringifyObject(viewedUser);
    const allUsersPosts = await getPostsByUser(params.id);
    userPosts = stringifyObject(allUsersPosts);
    formattedDate = formatDate(user.joinDate);
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="text-light-1 head-text">Error</h1>
        <NoResults
          title="Error fetching user data"
          description="There was an error fetching the user data. Maybe the user you are looking for doesn't exist. Try to reload the page or press the button to go back. If that didn't help, Please try again later."
          buttonTitle="Go back"
          href="../"
        />
      </div>
    );
  }
  return (
    <section>
      <ProfileHeader
        accounClerkId={user.clerkId}
        img={user.image}
        name={user.name}
        userIdView={userId || ""}
        username={user.username}
        bio={user.bio || ""}
        bioLink={user.portfolio || ""}
        location={user.location || ""}
        joinedDate={formattedDate}
      />
      <div className="mt-12">
        <h3 className="text-light-1 text-heading3-bold">
          Created Threads{" "}
          <span className="bg-light-4 p-1">{userPosts.length}</span>
        </h3>
        <div className="flex flex-col gap-8 mt-9">
          {userPosts.length > 0 ? (
            userPosts.map((threadData: any) => {
              return (
                <ThreadCard
                  key={threadData._id}
                  id={threadData._id}
                  parentId={threadData.parentId}
                  currentUserClerkId={userId ? userId : ""}
                  content={threadData.text}
                  author={threadData.author}
                  community={threadData.community}
                  createdAt={threadData.createdAt}
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
            })
          ) : (
            <NoResults
              title="No threads found"
              description="This user hasn't created any threads"
              buttonTitle="Explore posts"
              href="/"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
