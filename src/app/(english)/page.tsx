import type { Metadata } from "next";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { translations } from "@/content/translations";

export const metadata: Metadata = {
  title: translations.en.metadata.pageTitle,
};

export default function HomePage() {
  return <Portfolio locale="en" />;
}
