// routes.ts
import {
    SquareTerminal,
    Bot,
    PartyPopper,
    Frame,
    Settings2,
    BookOpen,
    LifeBuoy,
    Send,
  } from 'lucide-react';
  
  export const ROUTES = {
    HOME: {
      id: 'home',
      title: 'Home',
      icon: SquareTerminal,
      url: '#',
      items: [
        { id: 'home.dashboard', title: 'Dashboard', url: '/studio', roles: ['admin', 'artist', 'label'] },
        { id: 'home.new_single', title: 'New Single', url: '/new_single', roles: [] },
        { id: 'home.new_artist', title: 'New Artist', url: '/artist', roles: ['admin', 'label'] }, // Override parent permissions
        { id: 'home.new_release', title: 'New Release', url: '/new_release', roles: ['admin', 'label', 'artist'] }, // Override parent permissions
        { id: 'home.releases', title: 'Releases', url: '/mwonya_release', roles: ['admin','label','artist'] },
      ],
    },
    EARNINGS: {
      id: 'earnings',
      title: 'Earnings',
      icon: Bot,
      url: '#',
      items: [
        { id: 'earnings.revenue', title: 'Revenue', url: '/revenue', roles: ['label', 'admin'] },
        { id: 'earnings.circle', title: 'Circle', url: '#', roles: [] },
      ],
    },
    EVENTS: {
      id: 'events',
      title: 'Events',
      icon: PartyPopper,
      url: '#',
      items: [
        { id: 'events.new', title: 'New', url: '#', roles: [] },
        { id: 'events.all', title: 'All Events', url: '#', roles: [] },
      ],
    },
    MANAGE: {
      id: 'manage',
      title: 'Manage',
      icon: Frame,
      url: '#',
      items: [
        { id: 'manage.new_artist', title: 'New Artist', url: '#', roles: [] },
        { id: 'manage.manage_artists', title: 'Manage Artists', url: '#', roles: [] },
      ],
    },
    SETTINGS: {
      id: 'settings',
      title: 'Settings',
      icon: Settings2,
      url: '#',
      items: [
        { id: 'settings.profile', title: 'Profile', url: '/artist_profile', roles: ['artist'] },
      ],
    },
    DOCUMENTATION: {
      id: 'documentation',
      title: 'Documentation',
      icon: BookOpen,
      url: '#',
      items: [
        { id: 'documentation.intro', title: 'Introduction', url: '#', roles: [] },
        { id: 'documentation.get_started', title: 'Get Started', url: '#', roles: [] },
        { id: 'documentation.tutorials', title: 'Tutorials', url: '#', roles: [] },
        { id: 'documentation.changelog', title: 'Changelog', url: '#', roles: [] },
      ],
    },
  };
  
  export const NAV_SECONDARY = [
    {
      id: 'contact',
      title: 'Contact',
      url: '#',
      icon: LifeBuoy,
    },
    {
      id: 'mail',
      title: 'Mail',
      url: '#',
      icon: Send,
    },
  ];