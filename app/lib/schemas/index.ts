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
  password: z
    .string()
    .min(8, {
      message: 'Minimum 8 characters'
    })
    .refine(noSpaces, {
      message: 'Password cannot contain spaces'
    }),
  name: z.string().min(1, {
    message: 'Name is required'
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
  biography: z
  .string()
  .min(10, "Biography should be at least 10 characters long")
  .optional()
  .or(z.literal("")),
  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE,  `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}.`
    ),
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE,  `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
        ", "
      )}.`
    ),
  isIndependent: z.boolean().optional(),
  labelId: z.string().optional(),
}).refine(
  (data) => data.isIndependent || (data.labelId && data.labelId.length > 0),
  {
    message: "labelId is required if the artist is not independent.",
    path: ["labelId"], // This will highlight the labelId field in case of error
  }
);



export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
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