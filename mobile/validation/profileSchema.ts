import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  imageUrl: z
    .string()
    .refine(
      (val) => val === "" || /^https?:\/\/.+/.test(val),
      { message: "Enter a valid URL" }
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
