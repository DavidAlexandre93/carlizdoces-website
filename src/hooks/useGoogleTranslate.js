import { useCallback, useEffect, useState } from 'react'

const LANGUAGE_STORAGE_KEY = 'carlizdoces:selected-language'
const GEO_API_URL = 'https://ipapi.co/json/'

const COUNTRY_LANGUAGE_MAP = {
  BR: 'pt',
  US: 'en',
  ES: 'es',
  FR: 'fr',
}

const SUPPORTED_LANGUAGES = ['pt', 'en', 'es', 'fr']

function getLanguageFromNavigator() {
  const browserLanguage = window.navigator.language?.slice(0, 2).toLowerCase()
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'pt'
}

async function getLanguageFromGeolocation() {
  try {
    const response = await fetch(GEO_API_URL)

    if (!response.ok) {
      return getLanguageFromNavigator()
    }

    const payload = await response.json()
    return COUNTRY_LANGUAGE_MAP[payload.country_code] ?? getLanguageFromNavigator()
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
      const nextLanguage = savedLanguage || await getLanguageFromGeolocation()
      applyLanguage(nextLanguage)
    }

    initializeLanguage()
  }, [applyLanguage])

  return {
    selectedLanguage,
    applyLanguage,
  }
}
