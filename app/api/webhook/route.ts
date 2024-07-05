/* eslint-disable camelcase */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.action";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;
  // eslint-disable-next-line no-console
  console.log(WEBHOOK_SECRET);

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  // eslint-disable-next-line camelcase
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;
    // Create a new user
    const mongoUser = await createUser(
      {
        clerkId: id,
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username,
        email: email_addresses[0].email_address,
        image: image_url,
      },
      "/"
    );
    return NextResponse.json({ message: "OK", user: mongoUser });
  }
  if (eventType === "user.updated") {
    const { id, email_addresses, image_url, username, first_name, last_name } =
      evt.data;
    // Update a user
    const mongoUser = await updateUser(
      id,
      {
        name: `${first_name}${last_name ? ` ${last_name}` : ""}`,
        username: username,
        email: email_addresses[0].email_address,
        image: image_url,
      },
      `/profile/${id}` // Adjust path as necessary
    );
    return NextResponse.json({ message: "OK", user: mongoUser });
  }
  if (eventType === "user.deleted") {
    const { id } = evt.data;
    // Delete a  user
    const deletedUser = await deleteUser(id!, "/");
    return NextResponse.json({ message: "OK", user: deletedUser });
  }
  // Listen organization creation event
  if (eventType === "organization.created") {
    // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
    // Show what evnt?.data sends from above resource
    const { id, name, slug, image_url, created_by } = evt?.data ?? {};

    try {
      await createCommunity(
        id,
        name,
        slug,
        image_url ? image_url : "",
        "org bio",
        created_by
      );

      return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization invitation creation event.
  // Just to show. You can avoid this or tell people that we can create a new mongoose action and
  // add pending invites in the database.
  if (eventType === "organizationInvitation.created") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
      console.log("Invitation created", evt?.data);

      return NextResponse.json(
        { message: "Invitation created" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization membership (member invite & accepted) creation
  if (eventType === "organizationMembership.created") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evt?.data;
      console.log("created", evt?.data);

      await addMemberToCommunity(organization.id, public_user_data.user_id);

      return NextResponse.json(
        { message: "Invitation accepted" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen member deletion event
  if (eventType === "organizationMembership.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evt?.data;
      console.log("removed", evt?.data);

      await removeUserFromCommunity(public_user_data.user_id, organization.id);

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization updation event
  if (eventType === "organization.updated") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
      // Show what evnt?.data sends from above resource
      const { id, image_url, name, slug } = evt?.data;
      console.log("updated", evt?.data);

      await updateCommunityInfo(id, name, slug, image_url ? image_url : "");

      return NextResponse.json({ message: "Member removed" }, { status: 201 });
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Listen organization deletion event
  if (eventType === "organization.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
      // Show what evnt?.data sends from above resource
      const { id } = evt?.data;
      console.log("deleted", evt?.data);

      await deleteCommunity(id!);

      return NextResponse.json(
        { message: "Organization deleted" },
        { status: 201 }
      );
    } catch (err) {
      console.log(err);

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  return new Response("", { status: 200 });
}
