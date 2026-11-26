import type { ProjectRoleKey } from "./translations";

export type Project = {
  number: string;
  name: string;
  href: string;
  date: {
    iso: string;
  };
  role: ProjectRoleKey;
};

export const projects: Project[] = [
  {
    number: "01",
    name: "STOLBYPC",
    href: "https://stolbypc.ru/",
    date: { iso: "2026-10-01" },
    role: "designDevelopment",
  },
  {
    number: "02",
    name: "ORANGY",
    href: "https://bvitriak.github.io/Orangy/",
    date: { iso: "2026-08-20" },
    role: "designDevelopment",
  },
];
