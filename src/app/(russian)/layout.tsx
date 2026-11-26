import type { Metadata } from "next";
import type { ReactNode } from "react";
import { translations } from "@/content/translations";
import { fontVariables } from "@/styles/fonts";
import "@/styles/tokens.css";
import "@/app/globals.css";

const metadataCopy = translations.ru.metadata;

export const metadata: Metadata = {
  title: {
    default: metadataCopy.defaultTitle,
    template: metadataCopy.titleTemplate,
  },
  description: metadataCopy.description,
  openGraph: {
    type: "website",
    locale: metadataCopy.openGraphLocale,
    title: metadataCopy.defaultTitle,
    description: metadataCopy.description,
  },
};

export default function RussianLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" data-theme="dark" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
