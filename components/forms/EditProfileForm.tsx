"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import NoResults from "../shared/NoResults";
import { useRouter } from "next/navigation";
import { EditProfileSchema } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.action";
import { useToast } from "../ui/use-toast";

const EditProfileForm = ({
  initialValues,
  userClerkId,
}: {
  initialValues?: any;
  userClerkId: string;
}) => {
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      bio: initialValues.bio || "",
      portfolio: initialValues.portfolio || "",
      location: initialValues.location || "",
    },
  });

  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    setIsSubmitting(true);
    try {
      // Your submit logic here
      const pathName = `/profile/${userClerkId}`;
      await updateUser(userClerkId, values, pathName);
      setIsSubmitting(false);
      router.push(pathName);
      toast({
        title: "Profile successfully edited.",
        className: "bg-green-500 border-none text-white",
      });
      return;
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to edit your profile.",
        className: "bg-red-500 border-none text-white",
      });
      setError("Error");
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <NoResults
        title="Error editing profile"
        description="An error occurred while trying to edit your profile. Please try again later."
        buttonTitle="Go back"
        href={`/profile/${userClerkId}`}
      />
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-semibold text-[20px] text-light-2">
                  Portfolio Link
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus border-dark-4 bg-dark-3 text-light-1 
                    min-h-[56px] border text-[16px] font-normal leading-[22.4px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Provide a valid URL to your portfolio.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-semibold text-[20px] text-light-2">
                  Location
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="no-focus border-dark-4 bg-dark-3 text-light-1 
                    min-h-[56px] border text-[16px] font-normal leading-[22.4px]"
                    placeholder="Example: Kyiv, Ukraine"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Provide your location (at least 10 characters).
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="font-semibold text-[20px] text-light-2">
                  Bio
                </FormLabel>
                <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                  <Textarea rows={5} {...field} />
                </FormControl>
                <FormDescription className="mt-2.5 font-spaceGrotesk text-[14px] font-normal leading-[19.6px] text-light-500">
                  Provide a brief bio about yourself (10-200 characters).
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 min-h-[46px] w-full bg-primary-500 px-4 py-3 font-semibold !text-light-1 transition-colors duration-300 ease-in-out hover:bg-purple-500 sm:w-fit"
            >
              {isSubmitting ? "Submitting..." : "Edit Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfileForm;
