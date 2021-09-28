interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navAdminItems: NavData[] = [
  {
    divider: true,
  },
  {
    title: true,
    name: "Navigation",
    class: "text-danger",
  },
  {
    name: "Home",
    url: "/home",
    icon: "icon-home text-danger",
  },
  {
    name: "Add event",
    url: "/add-event",
    icon: "icon-plus text-success",
  },
  {
    name: "Profile",
    url: "/profile",
    icon: "icon-user text-primary",
  },
  {
    name: "Settings",
    url: "/settings",
    icon: "fa fa-wrench text-warning",
  },
  {
    divider: true,
  },
  {
    title: true,
    name: "Admin space",
    class: "text-primary",
  },
  {
    name: "Users",
    url: "/admin-space-users",
    icon: "icon-people  text-success",
  },
  {
    name: "Events",
    url: "/admin-space-events",
    icon: "icon-chart text-info",
  },
  {
    name: "Tickets",
    url: "/admin-space-tickets",
    icon: "icon-basket-loaded text-info",
  },
  {
    name: "Tags",
    url: "/admin-space-tags",
    icon: "fa fa-hashtag text-warning",
  },
];
