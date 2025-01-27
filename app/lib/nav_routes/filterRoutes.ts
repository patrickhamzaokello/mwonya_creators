import { resolvePermissions } from './resolvePermissions';
import { NAV_SECONDARY } from './routes';

type Role = 'admin' | 'artist' | 'label' | 'user';

export const filterRoutes = (role: Role) => {
  const filteredNavMain = resolvePermissions(role);

  return {
    navMain: filteredNavMain,
    navSecondary: NAV_SECONDARY, // Assuming secondary nav is the same for all roles
  };
};