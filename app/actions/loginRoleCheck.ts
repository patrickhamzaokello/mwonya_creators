import { getArtistProfileByUserId } from '@/data-layer/artist';
import { UserRole } from "@/types/user";
import { Session } from "next-auth";

export const loginRoleChecks = async (session: Session | null) => {
    const profileStatus = {
        hasArtistProfile: false,
        hasLabelProfile: false,
        isMwonyaAdmin: false,
        needsProfileCreation: false,
        isUser: false
    };

    if (!session) {
        profileStatus.needsProfileCreation = true;
        return profileStatus;
    }

    switch (session?.user.role) {
        case UserRole.ADMIN:
            profileStatus.isMwonyaAdmin = true;
            break;
        case UserRole.ARTIST:
            const artistProfile = session?.user.id ? await getArtistProfileByUserId(session.user.id) : null;
            if (artistProfile.status && artistProfile.artist_available) {
                profileStatus.hasArtistProfile = true;
            } else {
                profileStatus.needsProfileCreation = true;
            }
            break;

        case UserRole.LABEL:
            const labelProfile = session?.user.id ? await getArtistProfileByUserId(session.user.id) : null;

            if (labelProfile) {
                profileStatus.hasLabelProfile = true;
            } else {
                profileStatus.needsProfileCreation = true;
            }
            break;

        case UserRole.USER:
            profileStatus.isUser = true;
            break;
        default:
            profileStatus.needsProfileCreation = true;
            break;
    }

    return profileStatus
};