import { getUserById, updateUserProfile } from '@/data-layer/user';
import { getArtistProfileByUserId } from '@/data-layer/artist';
import { getLabelProfileByUserId } from '@/data-layer/label';
import { UserRole } from "@/types/user"

export const loginRoleChecks = async (userid: string) => {
    const profileStatus = {
        hasArtistProfile: false,
        hasLabelProfile: false,
        isMwonyaAdmin: false,
        needsProfileCreation: false
    };

    const user = await getUserById(userid);
    if (user?.role) {
        switch (user.role) {
            case UserRole.ARTIST:
                const artistProfile = await getArtistProfileByUserId(userid);
                if (artistProfile) {
                    profileStatus.hasArtistProfile = true;
                } else {
                    profileStatus.needsProfileCreation = true;
                }
                break;
            case UserRole.LABEL:
                const labelProfile = await getLabelProfileByUserId(userid);
                if (labelProfile) {
                    profileStatus.hasLabelProfile = true;
                } else {
                    profileStatus.needsProfileCreation = true;
                }
                break;

            case UserRole.ADMIN:
                profileStatus.isMwonyaAdmin = true
                break;
          


                break;
        }
    }

    return {
        user: {
            id: user?.id,
            email: user?.email,
            name: user?.name,
            role: user?.role
        },
        profileStatus
    };
}
