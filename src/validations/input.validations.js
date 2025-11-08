import * as z from "zod";
/*
watchHistory ObjectId of videos
  email loggedIn with unique as well
  fullName signUp information
  avatar string link to photo or something similar
  coverImage string link
  password string 
  refreshToken authentication and cookies handling

*/

const signUpValidation = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),

  degree: z
    .string({ required_error: "Degree is required" })
    .min(2, "Degree must be at least 2 characters"),

  speciality: z
    .string({ required_error: "Speciality is required" })
    .min(2, "Speciality must be at least 2 characters"),

  experience: z
    .string({ required_error: "Experience is required" })
    .min(1, "Experience cannot be empty"),

  about: z
    .string({ required_error: "About section is required" })
    .min(10, "About must be at least 10 characters"),

  // Convert string "500" → number 500 automatically
  fees: z
    .string()
    .refine((val) => !isNaN(val), { message: "Fees must be a valid number" })
    .transform((val) => Number(val)),

  // Define structure for address
  address: z.object({
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
  }),
});

const logInValidation = z.object({
  userName: z.string().min(5).max(30),
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

export { signUpValidation, logInValidation };
