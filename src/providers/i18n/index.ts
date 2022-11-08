import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from './en';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */ // locale might be used later, if I'm adding more languages.
const i18nProvider = polyglotI18nProvider((locale) => en, 'en');

export default i18nProvider;
