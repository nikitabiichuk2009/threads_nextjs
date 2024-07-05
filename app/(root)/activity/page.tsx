import NoResults from "@/components/shared/NoResults";
import { getActivity, getUserById } from "@/lib/actions/user.action";
import { stringifyObject } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Activity = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  let activity;
  try {
    const user = await getUserById(userId);
    const activityFetched = await getActivity(user._id);
    activity = stringifyObject(activityFetched);
  } catch (err) {
    console.log(err);
    return (
      <div>
        <h1 className="head-text text-light-1">Error occurred</h1>
        <NoResults
          title="Error loading your activity"
          description="Failed to load activity. Please try reloading the page, pressing the button, or trying again later."
          buttonTitle="Go back"
          href="/"
        />
      </div>
    );
  }
  return (
    <section>
      <h1 className="head-text text-light-1">Activity</h1>\
      <p className="text-base-regular text-light-2 flex flex-row text-[21px]">
        Your posts have received&nbsp;
        <span className="font-semibold">{activity.totalLikes}</span>&nbsp;
        <span className="flex flex-row font-semibold">
          {activity.totalLikes === 1 ? "like" : "likes"}&nbsp;
          <Image
            className="object-contain"
            alt="heart red"
            src={"/assets/heart-filled.svg"}
            width={24}
            height={24}
          />
        </span>
        &nbsp;in total.
      </p>
      <div className="flex flex-col gap-5 mt-12">
        {activity.replies.length === 0 ? (
          <p className="text-light-2 text-base-medium">No replies yet</p>
        ) : (
          activity.replies.map((reply: any) => {
            return (
              <div key={reply._id}>
                <Link href={`/thread/${reply._id}`}>
                  <article className="activity-card">
                    <div className="relative size-12">
                      <Image
                        src={reply.author.image}
                        alt="profile image"
                        layout="fill"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="text-light-1">
                      <span className="mr-1 text-primary-500">
                        {reply.author.name}
                      </span>
                      replied to your thread
                    </p>
                  </article>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Activity;
