import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().int().min(1, "Rating is required").max(5, "Rating must be at most 5"),
  comment: z.string().min(1, "Please enter a comment"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
