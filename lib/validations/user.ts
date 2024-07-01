import * as z from "zod";

export const userValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, { message: "Please use at least 3 characters." })
    .max(50, "Please use not more than 50 characters"),
  username: z
    .string()
    .min(3, { message: "Please use at least 3 characters." })
    .max(30, "Please use not more than 30 characters"),
  bio: z
    .string()
    .min(20, { message: "Please use at least 20 characters." })
    .max(200, "Please use not more than 200 characters"),
  portfolio: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(val), {
      message: "Portfolio link must be a valid URL",
    }),
  location: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "Location must be at least 10 characters long",
    }),
});
