import { prisma } from "@/lib/prisma";
import {auth} from "@/auth"

export async function createMediaUploadDescription({ content, mediaId }: TMediaUploadDescription) {
    const session = await auth();
    if (!session) {
        return { failure: "Not authenticate" }
    }

    // make sure mediaId exist and is created by current user
    const mediaItem = await prisma.mediaUpload.findUnique({
        where: {
            id: mediaId,
            userId: session.user.id,
        }
    })

    if (!mediaItem) {
        return { failure: "Media item not found" }
    }
    // create a media description
    const mediaDescription = await prisma.mediaDescription.create({
        data: {
            content,
            mediaId: mediaItem.id,
        }
    })
    // link uploaded media to the media description
    await prisma.mediaUpload.update({
        where: {
            id: mediaItem.id,
        },
        data: {
            mediaDescriptions: {
                connect: { id: mediaDescription.id },
            },
        },
    });
}