import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  // Add these back when you uncomment the corresponding menu items
  // Settings as SettingsIcon,
  // Analytics as AnalyticsIcon,
} from '@mui/icons-material';

export interface MenuItem {
  id: string;
  title?: string;
  icon?: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  chip?: string;
  chipColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  subheader?: string;
  navlabel?: boolean;
}

const MenuItems: MenuItem[] = [
  {
    id: 'main-section',
    navlabel: true,
    subheader: 'Main',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: DashboardIcon,
    href: '/admin',
  },
  {
    id: 'administration-section',
    navlabel: true,
    subheader: 'Administration',
  },
  {
    id: 'user-management',
    title: 'User Management',
    icon: PeopleIcon,
    children: [
      {
        id: 'users',
        title: 'Users',
        href: '/admin/users',
      },
      // Add more user management features here as needed
      // {
      //   id: 'roles-permissions',
      //   title: 'Roles & Permissions',
      //   href: '/admin/roles',
      // },
    ],
  },
  // Add more sections as your app grows
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   icon: SettingsIcon,
  //   children: [
  //     {
  //       id: 'general-settings',
  //       title: 'General Settings',
  //       href: '/admin/settings/general',
  //     },
  //     {
  //       id: 'integrations',
  //       title: 'Integrations',
  //       href: '/admin/settings/integrations',
  //     },
  //   ],
  // },
  // {
  //   id: 'analytics',
  //   title: 'Analytics',
  //   icon: AnalyticsIcon,
  //   href: '/admin/analytics',
  // },
];

export default MenuItems;
