import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const UserCard = ({
  clerkId,
  img,
  personType,
  name,
  username,
}: {
  clerkId: string;
  img: string;
  personType: string;
  name: string;
  username: string;
}) => {
  return (
    <article className="user-card">
      <div className="user-avatar">
        <div className="relative size-12 mb-5">
          <Image
            src={img}
            alt="profile image"
            layout="fill"
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-gray-1">@{username}</p>
        </div>
      </div>
      <Link href={`/profile/${clerkId}`}>
        <Button className="user-card_btn">View</Button>
      </Link>
    </article>
  );
};

export default UserCard;
