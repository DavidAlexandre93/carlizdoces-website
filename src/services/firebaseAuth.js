const readFirebaseEnvVar = (envVarName) => String(import.meta.env[envVarName] ?? '').trim()

const projectId = readFirebaseEnvVar('VITE_FIREBASE_PROJECT_ID')

const firebaseConfig = {
  apiKey: readFirebaseEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: readFirebaseEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || (projectId ? `${projectId}.firebaseapp.com` : ''),
  projectId,
  storageBucket: readFirebaseEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || (projectId ? `${projectId}.appspot.com` : ''),
  messagingSenderId: readFirebaseEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readFirebaseEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: readFirebaseEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
}

const isFirebaseAuthConfigured = () => Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.projectId
  && firebaseConfig.appId,
)

const getFirebaseNamespace = () => window.firebase ?? null

const getFirebaseUiNamespace = () => window.firebaseui ?? null

const initializeFirebaseAuth = () => {
  if (!isFirebaseAuthConfigured()) {
    return null
  }

  const firebaseNamespace = getFirebaseNamespace()
  if (!firebaseNamespace?.apps || !firebaseNamespace?.initializeApp || !firebaseNamespace?.auth) {
    return null
  }

  try {
    if (!firebaseNamespace.apps.length) {
      firebaseNamespace.initializeApp(firebaseConfig)
    }

    return firebaseNamespace.auth()
  } catch {
    return null
  }
}

const subscribeToFirebaseUser = (onUserChange) => {
  const firebaseAuth = initializeFirebaseAuth()
  if (!firebaseAuth) {
    onUserChange(null)
    return () => {}
  }

  return firebaseAuth.onAuthStateChanged((user) => {
    onUserChange(user ?? null)
  })
}

const resolveFirebaseUiConfig = () => {
  const firebaseNamespace = getFirebaseNamespace()

  return {
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
    signInFlow: 'popup',
    signInOptions: [
      {
        provider: firebaseNamespace.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
      },
      firebaseNamespace.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '#contato',
    privacyPolicyUrl: '#contato',
  }
}

const startFirebaseUiLogin = ({ containerSelector, onSuccess, onError }) => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseUiNamespace = getFirebaseUiNamespace()

  if (!firebaseAuth || !firebaseUiNamespace?.auth?.AuthUI) {
    throw new Error('firebase-ui-auth-not-available')
  }

  const authUi = firebaseUiNamespace.auth.AuthUI.getInstance()
    ?? new firebaseUiNamespace.auth.AuthUI(firebaseAuth)

  authUi.start(containerSelector, {
    ...resolveFirebaseUiConfig(),
    callbacks: {
      signInSuccessWithAuthResult: (authResult) => {
        if (typeof onSuccess === 'function') {
          onSuccess(authResult?.user ?? null)
        }
        return false
      },
      signInFailure: (error) => {
        if (typeof onError === 'function') {
          onError(error)
        }
        return Promise.resolve()
      },
      uiShown: () => {
        const loaderElement = document.getElementById('firebaseui-loader')
        if (loaderElement) {
          loaderElement.style.display = 'none'
        }
      },
    },
  })

  return authUi
}

const resetFirebaseUi = () => {
  const firebaseUiNamespace = getFirebaseUiNamespace()
  const authUi = firebaseUiNamespace?.auth?.AuthUI?.getInstance?.()
  if (!authUi) {
    return Promise.resolve()
  }

  return authUi.reset()
}

export {
  initializeFirebaseAuth,
  isFirebaseAuthConfigured,
  resetFirebaseUi,
  startFirebaseUiLogin,
  subscribeToFirebaseUser,
}
