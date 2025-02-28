import { z, ZodType } from "zod";

const noSpaces = (value: string) => {
  if (value.includes(' ')) {
    return false
  } else {
    return true
  }
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, {
      message: 'Password is required'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    })
})

export const RegisterSchema = z.object({
  email: z.string().email(),
  phone_number: z.string().min(10, {
    message: 'Phone number is required'
  }),
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    }),
  name: z.string().min(1, {
    message: 'User name is required'
  })
})



export const CreateRecordLableSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
});

const MAX_FILE_SIZE = 3 * 1024 * 1024;; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];



export const CreateArtistSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  genre: z.string().min(1, { message: "Please select a genre." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(10, { message: "Phone number is required." }),
  biography: z
    .string()
    .min(10, "Biography should be at least 10 characters long")
    .optional()
    .or(z.literal("")),
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}.`
    ),
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}.`
    ),
  terms_conditions_pp: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Terms and conditions must be accepted.",
    })
    .optional(),
  content_upload_policy: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Content upload policy must be accepted.",
    })
    .optional(),
  isIndependent: z.boolean().optional(),
  labelName: z.string().optional(),
  socialLinks: z.object({

    instagram: z.string().optional(),

    twitter: z.string().optional(),

    facebook: z.string().optional(),

    youtube: z.string().optional(),

  }).optional(),
}).refine(
  (data) => data.isIndependent || (data.labelName && data.labelName.length > 0),
  {
    message: "Record Label Name is required if the artist is not independent.",
    path: ["labelName"], // This will highlight the labelId field in case of error
  }
);



export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
})

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    })
})