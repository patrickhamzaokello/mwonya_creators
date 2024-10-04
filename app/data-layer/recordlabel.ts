import { prisma } from "@/lib/prisma";

// check if artist name exists
export const getLabelByName = async (label_name: string) => {
    try {
        const recordLabel = await prisma.recordLabel.findFirst({
            where: { name: label_name }
        });

        return recordLabel;
    } catch {
        return null;
    }
}

// create new artist
export const CreateNewRecordLabel = async (userId: string | undefined, name: string, contactEmail: string, contactPhone: string| undefined, website: string| undefined, address: string| undefined, city: string| undefined, state: string| undefined, country: string) => {
    const recordLabel = await prisma.recordLabel.create({
        data: {
            name,
            contactEmail,
            contactPhone,
            website,
            address,
            city,
            state,
            country
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: { recordLabelId: recordLabel.id }
    });
    

    return { success: { recordLabelName: recordLabel.name, recordLabelID: recordLabel.id } };
}
