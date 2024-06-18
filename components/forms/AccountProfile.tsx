"use client";
import React from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { userValidation } from '@/lib/validations/user';
import { z } from 'zod';
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
import Image from 'next/image';

interface Props {
  user: {
    id: string | undefined,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
  },
  btnTitle: string,
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const form = useForm<z.infer<typeof userValidation>>({
    resolver: zodResolver(userValidation),
    defaultValues: {
      profile_photo: '',
      name: '',
      username: '',
      bio: '',
      portfolio: '',
      location: '',
    }
  });

  function onSubmit(values: z.infer<typeof userValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        {/* <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel>
                {field.value ? (
                  <div className='relative size-36'>
                    <Image src={field.value} alt="profile photo" layout="fill" priority className='rounded-full object-cover' />
                  </div>
                ) :
                  <Image src={"/assets/profile.svg"} width={35} height={35} alt="no profile photo" className='object-contain' />
                }
              </FormLabel>
              <FormControl>
                <Input 
                type="file"
                accept='image\*'
                placeholder="Upload a photo"
                onChange={(e) => handleImage}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile