import localFont from "next/font/local";

const adventProLatin = localFont({
  src: "../assets/fonts/advent-pro/latin.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-advent-pro-latin",
  adjustFontFallback: false,
});

const adventProCyrillic = localFont({
  src: "../assets/fonts/advent-pro/cyrillic.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-advent-pro-cyrillic",
  adjustFontFallback: false,
});

const juraLatin = localFont({
  src: "../assets/fonts/jura/latin.woff2",
  display: "swap",
  weight: "300 700",
  variable: "--font-jura-latin",
  adjustFontFallback: false,
});

const juraCyrillic = localFont({
  src: "../assets/fonts/jura/cyrillic.woff2",
  display: "swap",
  weight: "300 700",
  variable: "--font-jura-cyrillic",
  adjustFontFallback: false,
});

const jetBrainsMonoLatin = localFont({
  src: "../assets/fonts/jetbrains-mono/latin.woff2",
  display: "swap",
  weight: "300 700",
  variable: "--font-jetbrains-mono-latin",
  adjustFontFallback: false,
});

const jetBrainsMonoCyrillic = localFont({
  src: "../assets/fonts/jetbrains-mono/cyrillic.woff2",
  display: "swap",
  weight: "300 700",
  variable: "--font-jetbrains-mono-cyrillic",
  adjustFontFallback: false,
});

export const fontVariables = [
  adventProLatin.variable,
  adventProCyrillic.variable,
  juraLatin.variable,
  juraCyrillic.variable,
  jetBrainsMonoLatin.variable,
  jetBrainsMonoCyrillic.variable,
].join(" ");
