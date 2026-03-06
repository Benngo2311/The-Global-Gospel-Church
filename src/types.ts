export type Language = 'en' | 'vi';

export interface NavItem {
  title: { en: string; vi: string };
  href: string;
  children?: NavItem[];
}

export interface Content {
  hero: {
    title: { en: string; vi: string };
    subtitle: { en: string; vi: string };
    cta: { en: string; vi: string };
  };
  about: {
    title: { en: string; vi: string };
    description: { en: string; vi: string };
  };
  contact: {
    address: string;
    email: string;
    phone: string;
  };
}
