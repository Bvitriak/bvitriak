import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { translations } from "@/content/translations";

export const metadata: Metadata = {
  title: translations.ru.metadata.pageTitle,
};

export default function RussianHomePage() {
  return <Portfolio locale="ru" />;
}
