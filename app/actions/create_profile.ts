"use server"
import * as z from "zod";
import { CreateArtistProfile, updateArtistImages } from "@/data-layer/artist";
import { auth } from '@/auth';
import { getUserById } from "@/data-layer/user";
import { getTrackSignedURL } from "./aws/release_track_upload";



const computeSHA256 = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    return hashHex
}

function generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

function generateArtistId(): string {
    const prefix = 'mcartist_';
    const timestamp = Date.now().toString(16); // Convert timestamp to hexadecimal
    const randomString = generateRandomString(6); // Generate a random string of length 6
    return `${prefix}${timestamp}${randomString}`;
}


export const registerArtist = async (formData: FormData) => {
    const session = await auth();
    const session_userID = session?.user.id;
    //check user id exist in the database
    const user = await getUserById(session_userID ?? "")
    if (!user) {
        return { status: "error", message: "You have to be signed in to create a new artist" }
    }

    try {
        const artistId = generateArtistId();
        const name = formData.get("name") as string;
        const genre = parseInt(formData.get('genre') as string);
        const email_addy = formData.get("email") as string;
        const phone_number = formData.get("phone_number") as string;
        const biography = formData.get("biography") as string;
        const isIndependent = formData.get("isIndependent") === "true";
        const artistProfileImage = formData.get("profileImage") as File;
        const artistCoverImage = formData.get("coverImage") as File;
        const labelName = formData.get("labelName") as string;
        const instagram = formData.get('socialLinks.instagram') as string ?? "";
        const twitter = formData.get('socialLinks.twitter') as string ?? "";
        const facebook = formData.get('socialLinks.facebook') as string ?? "";
        const youtube = formData.get('socialLinks.youtube') as string ?? "";
        const terms_conditions_pp = formData.get("terms_conditions_pp") === "true";
        const content_upload_policy = formData.get("content_upload_policy") === "true";
        const current_userId = user?.id;


        const socialLinks = {
            instagram,
            twitter,
            facebook,
            youtube
          };

        const artistProfile: ArtistProfile = {
            artistID: artistId,
            artistName: name,
            artistEmail: email_addy,
            artistPhoneNumber: phone_number,
            artistGenre: genre,
            artistBiography: biography,
            artistIsIndependent: isIndependent,
            artistlabelName: labelName,
            socialLinks: socialLinks,
            artistAgreetoTermsConditions: terms_conditions_pp,
            artistAgreetoContentUploadPolicy: content_upload_policy,
            current_userId: current_userId
        };

        try {
            console.log(artistProfile);
            const createArtist = await CreateArtistProfile(artistProfile);

            if (!createArtist.success) {
                return { status: "error", message: createArtist.message };
            }

            const artistImages = [
                { type_tag: 'profile_image', file: artistProfileImage },
                { type_tag: 'cover_image', file: artistCoverImage }
            ];

            for (const { type_tag, file } of artistImages) {
                const checksum = await computeSHA256(file)
                const signedURLResult = await getTrackSignedURL(file.type, file.size, checksum, type_tag, 'images/artist/');

                if (signedURLResult.failure !== undefined) {
                    return {
                        status: "error",
                        message: `Error getting signed url`,
                    };
                }

                const { signedURL, upload_id } = signedURLResult.success

                await fetch(signedURL, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                });                

                // update artist profile with upload data
                const Imageupdate = await updateArtistImages(createArtist.artist_id, upload_id, type_tag, current_userId);
                if (!Imageupdate.success) {
                    return { status: "error", message: Imageupdate.message };
                }

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