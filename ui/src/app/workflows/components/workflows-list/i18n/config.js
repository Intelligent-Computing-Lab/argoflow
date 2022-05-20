import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//配置中文的配置文件
import translation_zh from './workflows-zh.json';
//配置英文的配置文件
import translation_en from './workflows-en.json';

const resources = {
  en: {
    translation: translation_en
  },
  zh: {
    translation: translation_zh
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
