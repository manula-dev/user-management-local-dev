import { z } from "zod";

// 1. මූලිකම සාමාන්‍ය Schema එක (Base Schema)
// මෙතන trim() සහ සියලුම නීති ලස්සනට හදලා තියෙන්නේ
export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. User Update Schema එක (.partial() මගින් සියල්ල optional වෙයි)
export const updateUserSchema = createUserSchema.partial();

// 3. Signup Schema එක (createUserSchema එකම අරන් ඒකට adminSecret එක විතරක් එකතු කරනවා 🚀)
export const signupSchema = createUserSchema.extend({
  adminSecret: z.string().trim().optional(),
});

// 4. Login Schema එක (මේක සම්පූර්ණයෙන්ම වෙනස් නිසා වෙනම ලියනවා)
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
