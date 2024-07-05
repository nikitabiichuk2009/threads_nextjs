import { fetchAllThreads } from "@/lib/actions/thread.action";
import { stringifyObject } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RightSidebar = async () => {
  const threads = await fetchAllThreads({});
  const latestThreads = stringifyObject(threads.allThreads);
  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-light-1 h3-bold">Latest Threads</h3>
      </div>
      <div>
        {latestThreads.length > 0 ? (
          <>
            <h3 className="h3-bold text-dark200_light900">Recent Questions</h3>
            <div className="mt-7 flex w-full flex-col gap-1">
              {latestThreads.map((thread: any) => (
                <Link
                  key={thread._id}
                  href={`/thread/${thread._id}`}
                  className="flex cursor-pointer items-center justify-between gap-7 rounded-md p-3 bg-dark-2 hover:bg-dark-1"
                >
                  <p className="body-medium text-gray-4 line-clamp-3">
                    {thread.text}
                  </p>
                  <Image
                    src="/assets/arrow.svg"
                    width={20}
                    height={20}
                    className="object-contain"
                    alt=""
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <h3 className="text-body-semibold text-light-1">No Latest Threads</h3>
        )}
      </div>
    </section>
  );
};

export default RightSidebar;
