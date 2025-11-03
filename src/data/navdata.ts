// src/data/navData.ts

export interface NavItem {
  label: string;
  path: string;
}

export const navData: NavItem[] = [
  { label: "HOME", path: "/" },
  { label: "HEADPHONES", path: "/Headphones" },
  { label: "SPEAKERS", path: "/Speakers" },
  { label: "EARPHONES", path: "/Earphones" },
];
