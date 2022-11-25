import { useEffect, useState } from 'react';
import { useLocaleState } from 'react-admin';
import { enGB } from 'date-fns/locale';

const locales = {
  en: enGB,
};

const isValidLocale = (locale: string): locale is keyof typeof locales => (
  Object.hasOwn(locales, locale)
);

const useDateFNSLocale = () => {
  const [locale] = useLocaleState();
  const [dateFNSLocale, setDateFNSLocale] = useState(locales.en);

  useEffect(() => {
    setDateFNSLocale(isValidLocale(locale) ? locales[locale] : locales.en);
  }, [locale]);

  return dateFNSLocale;
};

export default useDateFNSLocale;
