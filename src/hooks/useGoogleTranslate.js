import { useCallback, useEffect, useState } from 'react';

const LANGUAGE_STORAGE_KEY = 'carlizdoces:selected-language';
const GEO_API_ENDPOINTS = ['https://ipapi.co/json/', 'https://ipwho.is/'];

const SUPPORTED_LANGUAGES = [
  'pt',
  'en',
  'es',
  'fr',
  'ja',
  'de',
  'it',
  'ar',
  'ru',
  'ko',
  'zh-CN',
  'zh-TW',
  'hi',
  'nl',
  'tr',
  'pl',
  'sv',
  'no',
  'da',
  'fi',
];

const LANGUAGE_ALIASES = {
  zh: 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-sg': 'zh-CN',
  'zh-hans': 'zh-CN',
  'zh-tw': 'zh-TW',
  'zh-hk': 'zh-TW',
  'zh-mo': 'zh-TW',
  'zh-hant': 'zh-TW',
  'pt-br': 'pt',
  'pt-pt': 'pt',
  'en-us': 'en',
  'en-gb': 'en',
  'es-es': 'es',
  'es-mx': 'es',
  'fr-fr': 'fr',
  'ja-jp': 'ja',
  'de-de': 'de',
  'it-it': 'it',
  'ar-sa': 'ar',
  'ru-ru': 'ru',
  'ko-kr': 'ko',
  'hi-in': 'hi',
};

const COUNTRY_LANGUAGE_MAP = {
  BR: 'pt',
  PT: 'pt',
  US: 'en',
  CA: 'en',
  GB: 'en',
  IE: 'en',
  AU: 'en',
  NZ: 'en',
  ZA: 'en',
  IN: 'hi',
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CL: 'es',
  CO: 'es',
  PE: 'es',
  UY: 'es',
  PY: 'es',
  BO: 'es',
  EC: 'es',
  VE: 'es',
  FR: 'fr',
  BE: 'fr',
  CH: 'fr',
  JP: 'ja',
  DE: 'de',
  AT: 'de',
  IT: 'it',
  RU: 'ru',
  UA: 'ru',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  DZ: 'ar',
  MA: 'ar',
  KR: 'ko',
  CN: 'zh-CN',
  SG: 'zh-CN',
  TW: 'zh-TW',
  HK: 'zh-TW',
  NL: 'nl',
  TR: 'tr',
  PL: 'pl',
  SE: 'sv',
  NO: 'no',
  DK: 'da',
  FI: 'fi',
};

function normalizeLanguageCode(language) {
  const normalized = (language ?? '').trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (LANGUAGE_ALIASES[normalized]) {
    return LANGUAGE_ALIASES[normalized];
  }

  const shortCode = normalized.split(/[-_]/)[0];

  if (SUPPORTED_LANGUAGES.includes(shortCode)) {
    return shortCode;
  }

  return null;
}

function getLanguageFromNavigator() {
  const preferredLanguages = window.navigator.languages ?? [window.navigator.language];

  for (const language of preferredLanguages) {
    const normalized = normalizeLanguageCode(language);

    if (normalized) {
      return normalized;
    }
  }

  return normalizeLanguageCode(window.navigator.language) ?? 'en';
}

function normalizeGeolocationPayload(payload) {
  const countryCode = String(payload?.country_code ?? payload?.country_code2 ?? '').toUpperCase();
  const languages = String(payload?.languages ?? payload?.language ?? '');

  return {
    countryCode,
    languages,
  };
}

function getLanguageFromApiPayload(payload) {
  const { countryCode, languages } = normalizeGeolocationPayload(payload);
  const languageByCountry = COUNTRY_LANGUAGE_MAP[countryCode];

  if (languageByCountry) {
    return languageByCountry;
  }

  const apiLanguages = languages
    .split(',')
    .map((language) => normalizeLanguageCode(language))
    .filter(Boolean);

  if (apiLanguages.length > 0) {
    return apiLanguages[0];
  }

  return getLanguageFromNavigator();
}

async function fetchJsonWithTimeout(url, timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

async function getLanguageFromGeolocation() {
  for (const endpoint of GEO_API_ENDPOINTS) {
    const payload = await fetchJsonWithTimeout(endpoint);

    if (payload) {
      return getLanguageFromApiPayload(payload);
    }
  }

  return getLanguageFromNavigator();
}

function persistGoogleTranslateCookie(language) {
  const cookieValue = `/pt/${language}`;
  const cookiePath = `googtrans=${cookieValue};path=/`;

  document.cookie = cookiePath;
  document.cookie = `${cookiePath};domain=${window.location.hostname}`;
}

function triggerGoogleTranslateChange(language) {
  const translateSelect = document.querySelector('.goog-te-combo');

  if (!translateSelect) {
    return false;
  }

  translateSelect.value = language;
  translateSelect.dispatchEvent(new Event('change'));
  return true;
}

function applyLanguageWithRetry(language, retriesLeft = 12) {
  const translated = triggerGoogleTranslateChange(language);

  if (translated || retriesLeft <= 0) {
    return;
  }

  window.setTimeout(() => {
    applyLanguageWithRetry(language, retriesLeft - 1);
  }, 300);
}

function loadTranslateScript() {
  if (document.getElementById('google-translate-script')) {
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

export function useGoogleTranslate() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt');

  const applyLanguage = useCallback((language) => {
    const normalizedLanguage = normalizeLanguageCode(language) ?? 'en';

    persistGoogleTranslateCookie(normalizedLanguage);
    applyLanguageWithRetry(normalizedLanguage);

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    setSelectedLanguage(normalizedLanguage);
  }, []);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          autoDisplay: false,
          includedLanguages: SUPPORTED_LANGUAGES.join(','),
        },
        'google_translate_element'
      );
    };

    loadTranslateScript();

    const initializeLanguage = async () => {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const nextLanguage =
        normalizeLanguageCode(savedLanguage) || (await getLanguageFromGeolocation());
      applyLanguage(nextLanguage);
    };

    initializeLanguage();
  }, [applyLanguage]);

  return {
    selectedLanguage,
    applyLanguage,
  };
}
