import { z } from "zod";

export const registerZodSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["CANDIDATE", "RECRUITER"], {
    message: "Please select a role",
  }),

  agreeToTerms: z
    .boolean()
    .refine((value) => value === true, {
      message: "You must agree to the Terms & Conditions",
    }),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;