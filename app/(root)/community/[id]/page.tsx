import ThreadCard from "@/components/cards/ThreadCard";
import NoResults from "@/components/shared/NoResults";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import { formatDate, stringifyObject } from "@/lib/utils";
import React from "react";

const CommunityDetails = async ({ params }: { params: { id: string } }) => {
  let community;
  let userPosts;
  let formattedDate;
  try {
    const communityDetails = await fetchCommunityDetails(params.id);
    community = stringifyObject(communityDetails);
    console.log(community);
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
        type="Community"
      />
      <div className="mt-12"></div>
    </section>
  );
};

export default CommunityDetails;
