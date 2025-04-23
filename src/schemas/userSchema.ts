import { z } from "zod";
import { UserStatus } from "../api/types";

export const userSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
    
  lastName: z
    .string()
    .max(50, { message: "Last name must be less than 50 characters" })
    .optional(),
    
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
    
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of birth is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { 
      message: "Date must be in format YYYY-MM-DD" 
    }),
    
  status: z.enum([UserStatus.ACTIVE, UserStatus.LOCKED], {
    errorMap: () => ({ message: "Status must be 'active' or 'locked'" }),
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;