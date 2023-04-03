import { NavTabs } from '../../types/Tab';

export const workspaceUsersTabs: NavTabs = {
  namespace: 'workspace-users-tabs',
  tabs: [
    {
      name: 'overview',
      href: '/[wsId]/users',
    },
    {
      name: 'list',
      href: '/[wsId]/users/list',
    },
    {
      name: 'roles',
      href: '/[wsId]/users/roles',
    },
  ],
};