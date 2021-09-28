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

export const navItems: NavData[] = [
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
];
