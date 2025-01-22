'use server';

import { getDetailCreatorAritstList } from "@/data-layer/artist";
import type { Artist } from '@/types/artist';
import { auth } from '@/auth'

import { redirect } from "next/navigation";


export async function listCreatorArtists(): Promise<Artist[] | MessageType> {
    const session = await auth();
    if (!session?.user.id) {
        redirect("/auth/login");
    }
    const creator_id = session.user.id;
    const creator_role = session.user.role;


    try {
        const data = await getDetailCreatorAritstList(creator_id,creator_role);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}