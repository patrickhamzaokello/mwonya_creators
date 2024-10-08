"use server"
import * as z from "zod";
import { CreateArtistSchema, CreateRecordLableSchema } from "@/lib/schemas";
import { CreateArtistProfile, getArtistProfileByName, isAnyArtistIndependentByUserId, SaveArtistProfileUpload, updateArtistProfileImage } from "@/data-layer/artist";
import { CreateNewRecordLabel, getLabelByName } from "@/data-layer/recordlabel";
import { auth } from '@/auth';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getUserById } from "@/data-layer/user";


export const transformZodErrors = (error: z.ZodError) => {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }));
};

const computeSHA256 = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    return hashHex
}
export const registerArtist = async (formData: FormData): Promise<MessageType> => {
    const session = await auth();
    const session_userID = session?.user.id;
    //check user id exist in the database
    const user = await getUserById(session_userID ?? "")
    if (!user) {
        return { status: "error", message: "You have to be signed in to create a new artist" }
    }
    const current_userId = user?.id;

    try {

        //validate the FormData
        const validatedFields = CreateArtistSchema.parse({
            name: formData.get("name"),
            genre: formData.get("genre"),
            biography: formData.get("biography"),
            isIndependent: formData.get("isIndependent") === "true" ? true : false,
            profileImage: formData.get("profileImage"),
            coverImage: formData.get("coverImage"),
            labelId: formData.get("labelId"),
            terms_conditions_pp: formData.get("terms_conditions_pp") === "true" ? true : false,
            content_upload_policy: formData.get("content_upload_policy") === "true" ? true : false,
        });


        const {
            name: artistName,
            genre: artistGenre,
            biography: artistBiography,
            isIndependent: artistIsIndependent,
            profileImage: artistProfileImage,
            coverImage: artistCoverImage,
            labelId: artistLabelId,
            terms_conditions_pp: artistAgreetoTermsConditions,
            content_upload_policy: artistAgreetoContentUploadPolicy
        } = validatedFields;

        // check if user is independent,
        const isUserIndependent = await isAnyArtistIndependentByUserId(current_userId)
        if (isUserIndependent) {
            return { status: "error", message: "You can not create more than one Artist Profile. This option is only available for Record Labels" };
        }

        // confirm name is not taken
        const exisitingName = await getArtistProfileByName(artistName)
        if (exisitingName) {
            return { status: "error", message: "Name already taken 😞" };
        }

        try {
            const createArtist = await CreateArtistProfile(artistName, artistGenre, artistBiography, artistIsIndependent, artistLabelId ?? "", artistAgreetoTermsConditions, artistAgreetoContentUploadPolicy, current_userId);
            
            if (!createArtist) {
                return { status: "error", message: "Failed to create Artist profile" };
            }

            const artistImages = [
                { type: 'profile', file: artistProfileImage },
                { type: 'cover', file: artistCoverImage }
            ];

            for (const { type, file } of artistImages) {
                const checksum = await computeSHA256(file);
                const signedURLResult = await generateSignedURL(file.type, file.size, checksum);

                if (signedURLResult.status === "error") {
                    return { status: "error", message: signedURLResult.message };
                }

                const { url, mediaId } = signedURLResult.result_content || {};
                if (!url || !mediaId) {
                    return { status: "error", message: "Failed to retrieve signed URL or media ID" };
                }

                await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });

                const validType: "profile" | "cover" = type as "profile" | "cover";
                await updateArtistProfileImage(createArtist.id, mediaId, validType);

            }


            return { status: "success", message: "Artist profile created successfully" };

        } catch (error) {
            return {
                status: "error",
                message: `Error creating artist profile: ${error}`,
            };
        }

    } catch (error) {
        return {
            status: "error",
            message: "General Error, contact system admin",
        };
    }
};

export const registerNewRecordLable = async (formData: FormData) => {
    const session = await auth();
    if (!session) {
        return { error: "This Action Requires You to login" }
    }

    try {

        //validate the FormData
        const validatedFields = CreateRecordLableSchema.parse({
            name: formData.get("name"),
            contactEmail: formData.get("contactEmail") || "",
            contactPhone: formData.get("contactPhone") || "",
            website: formData.get("website") || "",
            address: formData.get("address") || "",
            city: formData.get("city") || "",
            state: formData.get("state") || "",
            country: formData.get("country") || ""
        });

        console.log({ validatedFields });

        const { name, contactEmail, contactPhone, website, address, city, state, country } = validatedFields;

        console.log(name);
        // confirm name is not taken
        const exisitingName = await getLabelByName(name)

        // display text if recordlabelname is taken
        if (exisitingName) {
            return { error: "Name already taken 😞" }
        }

        const createRecordLabel = await CreateNewRecordLabel(session?.user.id, name, contactEmail, contactPhone, website, address, city, state, country);


        const { recordLabelName, recordLabelID } = createRecordLabel.success

        return {
            success: `Record Label ${recordLabelName} Created Successfully`,
        };


    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                error: transformZodErrors(error),
            };
        }

        return {
            error: "An unexpected error occurred. Could not create shelf.",
        };
    }
};



//using edge function to generate file names
const generateFilename = (fileType: string, bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    const randomString = Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
    const extension = fileType.split('/')[1];
    return `${randomString}.${extension}`;
}

const s3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY!,
    },
})


const acceptedFileTypes = ["image/jpeg", "image/JPG", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "audio/mp3", "audio/wav", "audio/m4a", "audio/mpeg"]

const maxFileSize = 10 * 1024 * 1024 // 10MB

export async function generateSignedURL(fileType: string, fileSize: number, checksum: string) {
    const session = await auth();
    if (!session) {
        return {
            status: "error",
            message: "User is unauthorized",
        }
    }

    if (!acceptedFileTypes.includes(fileType)) {
        return {
            status: "error",
            message: "Invalid File Type.. Try again",
        }
    }

    if (fileSize > maxFileSize) {
        return {
            status: "error",
            message: "File size too large.. Try again",
        }
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: generateFilename(fileType),
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
        Metadata: {
            userId: session.user.id ?? "null",
        }
    })
    const signedURL = await getSignedUrl(s3 as any, putObjectCommand as any, {
        expiresIn: 300, // link available for only 5 mins 60 * 5
    });

    const mediaResult = await SaveArtistProfileUpload(signedURL.split("?")[0], fileType.startsWith("image") ? "image" : fileType.startsWith("video") ? "video" : "audio", session.user.id ?? "null")

    if (!mediaResult) {
        return {
            status: "error",
            message: "Unable to save Profile Uploads.. Try again",
        };
    }

    return { result_content: { url: signedURL, mediaId: mediaResult.id } }
}