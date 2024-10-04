import { getUserById, updateUserProfile } from '@/data-layer/user';
import { getArtistProfileByUserId } from '@/data-layer/artist';
import { UserRole } from "@/types/user"

export const loginRoleChecks = async (userid: string) => {
    let profileStatus = {
        hasArtistProfile: false,
        hasLabelProfile: false,
        needsProfileCreation: false
    };

    const user = await getUserById(userid);
    if (user?.role) {
        switch (user.role) {
            case UserRole.ARTIST:
                profileStatus.hasArtistProfile = true;
                break;
            case UserRole.LABEL:
                profileStatus.hasLabelProfile = true;
                break;
            case UserRole.USER:
                // Check if user has an artist profile
                const artistProfile = await getArtistProfileByUserId(userid);
                if (artistProfile) {
                    profileStatus.hasArtistProfile = true;
                    // Update user role to artist
                    if (user.role === UserRole.USER) {
                        await updateUserProfile(userid, { role: UserRole.ARTIST });
                    }
                }

                // Check if user is associated with a record label
                if (user.recordLabelId) {
                    profileStatus.hasLabelProfile = true;
                    // Update user role if necessary
                    if (user.role === UserRole.USER) {
                        await updateUserProfile(userid, { role: UserRole.LABEL });
                    }
                }

                // If user has neither artist nor label profile, they need to create one
                if (!profileStatus.hasArtistProfile && !profileStatus.hasLabelProfile) {
                    profileStatus.needsProfileCreation = true;
                }

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
