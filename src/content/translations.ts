export type Locale = "en" | "ru";
export type ProjectRoleKey = "designDevelopment";
export type MonthKey =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export type Translation = {
  metadata: {
    defaultTitle: string;
    pageTitle: string;
    titleTemplate: string;
    description: string;
    openGraphLocale: string;
  };
  skip: string;
  brandHome: string;
  navigation: {
    label: string;
    index: string;
    projects: string;
    contact: string;
  };
  hero: {
    role: string;
    statement: string;
  };
  loading: {
    status: string;
    portfolio: string;
  };
  projects: {
    open: string;
    roles: Record<ProjectRoleKey, string>;
    months: Record<MonthKey, string>;
  };
  contact: {
    linksLabel: string;
  };
  theme: {
    label: string;
    dark: string;
    light: string;
  };
  language: {
    label: string;
    english: string;
    russian: string;
  };
};

export const translations: Record<Locale, Translation> = {
  en: {
    metadata: {
      defaultTitle: "Bvitriak – Designer & Developer",
      pageTitle: "Bvitriak – Designer & Developer",
      titleTemplate: "%s – Bvitriak",
      description:
        "Building calm, precise digital interfaces and interactive experiences where visual craft meets clean engineering.",
      openGraphLocale: "en_US",
    },
    skip: "Skip to content",
    brandHome: "Bvitriak, home",
    navigation: {
      label: "Main navigation",
      index: "Home",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      role: "Designer & Developer",
      statement:
        "Born in 2007 in Krasnoyarsk, Russia. I create considered digital interfaces and interactive web experiences, bringing visual precision together with clean code.",
    },
    loading: {
      status: "Loading portfolio",
      portfolio: "Portfolio",
    },
    projects: {
      open: "Open project",
      roles: {
        designDevelopment: "Design & Development",
      },
      months: {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Apr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec",
      },
    },
    contact: {
      linksLabel: "Find me on",
    },
    theme: {
      label: "Toggle color theme",
      dark: "Dark",
      light: "Light",
    },
    language: {
      label: "Choose language",
      english: "English",
      russian: "Russian",
    },
  },
  ru: {
    metadata: {
      defaultTitle: "Bvitriak – дизайнер и разработчик",
      pageTitle: "Избранные проекты",
      titleTemplate: "%s – Bvitriak",
      description:
        "Создаю выверенные цифровые интерфейсы и интерактивный веб, где визуальная точность встречается с чистым кодом.",
      openGraphLocale: "ru_RU",
    },
    skip: "Перейти к содержимому",
    brandHome: "Bvitriak, на главную",
    navigation: {
      label: "Основная навигация",
      index: "Главная",
      projects: "Проекты",
      contact: "Контакты",
    },
    hero: {
      role: "Дизайнер и разработчик",
      statement:
        "Родился в 2007 году в Красноярске, Россия. Создаю продуманные цифровые интерфейсы и интерактивный веб, соединяя визуальную точность с чистым кодом.",
    },
    loading: {
      status: "Загрузка портфолио",
      portfolio: "Портфолио",
    },
    projects: {
      open: "Открыть проект",
      roles: {
        designDevelopment: "Дизайн и разработка",
      },
      months: {
        "01": "янв",
        "02": "фев",
        "03": "мар",
        "04": "апр",
        "05": "май",
        "06": "июн",
        "07": "июл",
        "08": "Авг",
        "09": "сен",
        "10": "Окт",
        "11": "ноя",
        "12": "дек",
      },
    },
    contact: {
      linksLabel: "Мои профили",
    },
    theme: {
      label: "Переключить цветовую тему",
      dark: "Тёмная",
      light: "Светлая",
    },
    language: {
      label: "Выбрать язык",
      english: "Английский",
      russian: "Русский",
    },
  },
};
