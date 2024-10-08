import { prisma } from "@/lib/prisma";

export const getAllGenre = async () => {
    try {
        const genre = await prisma.genre.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return genre;
    } catch {
        return false;
    }
}