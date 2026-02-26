import { useCallback, useEffect, useState } from 'react'

const LANGUAGE_STORAGE_KEY = 'carlizdoces:selected-language'
const GEO_API_URL = 'https://ipapi.co/json/'

const COUNTRY_LANGUAGE_MAP = {
  BR: 'pt',
  US: 'en',
  FR: 'fr',
  JP: 'ja',
}

const SUPPORTED_LANGUAGES = ['pt', 'en', 'es', 'fr', 'ja', 'de', 'it']

function normalizeLanguageCode(language) {
  const normalized = (language ?? '').trim().toLowerCase()

  if (!normalized) {
    return null
  }

  const shortCode = normalized.split(/[-_]/)[0]
  return SUPPORTED_LANGUAGES.includes(shortCode) ? shortCode : null
}

function getLanguageFromNavigator() {
  return normalizeLanguageCode(window.navigator.language) ?? 'en'
}

function getLanguageFromApiPayload(payload) {
  const languageByCountry = COUNTRY_LANGUAGE_MAP[payload?.country_code]

  if (languageByCountry) {
    return languageByCountry
  }

  const apiLanguages = String(payload?.languages ?? '')
    .split(',')
    .map((language) => normalizeLanguageCode(language))
    .filter(Boolean)

  if (apiLanguages.length > 0) {
    return apiLanguages[0]
  }

  return getLanguageFromNavigator()
}

async function getLanguageFromGeolocation() {
  try {
    const response = await fetch(GEO_API_URL)

    if (!response.ok) {
      return getLanguageFromNavigator()
    }

    const payload = await response.json()
    return getLanguageFromApiPayload(payload)
  } catch {
    return getLanguageFromNavigator()
  }
}

function persistGoogleTranslateCookie(language) {
  const cookieValue = `/pt/${language}`
  const cookiePath = `googtrans=${cookieValue};path=/`

  document.cookie = cookiePath
  document.cookie = `${cookiePath};domain=${window.location.hostname}`
}

function triggerGoogleTranslateChange(language) {
  const translateSelect = document.querySelector('.goog-te-combo')

  if (!translateSelect) {
    return false
  }

  translateSelect.value = language
  translateSelect.dispatchEvent(new Event('change'))
  return true
}

function loadTranslateScript() {
  if (document.getElementById('google-translate-script')) {
    return
  }

  const script = document.createElement('script')
  script.id = 'google-translate-script'
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

export function useGoogleTranslate() {
  const [selectedLanguage, setSelectedLanguage] = useState('pt')

  const applyLanguage = useCallback((language) => {
    persistGoogleTranslateCookie(language)

    const translated = triggerGoogleTranslateChange(language)

    if (!translated) {
      window.setTimeout(() => {
        triggerGoogleTranslateChange(language)
      }, 650)
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    setSelectedLanguage(language)
  }, [])

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          autoDisplay: false,
          includedLanguages: SUPPORTED_LANGUAGES.join(','),
        },
        'google_translate_element',
      )
    }

    loadTranslateScript()

    const initializeLanguage = async () => {
      const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      const nextLanguage = normalizeLanguageCode(savedLanguage) || await getLanguageFromGeolocation()
      applyLanguage(nextLanguage)
    }

    initializeLanguage()
  }, [applyLanguage])

  return {
    selectedLanguage,
    applyLanguage,
  }
}
