import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    stock: z.coerce.number().min(0, "Stock must be a positive number").optional().default(0),
    category: z.string().min(1, "Category is required"),
});
