const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB8eq9Que0GvzGQvFcjOi0SeIvCnG9rNp0'),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'carliz-doces.firebaseapp.com'),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID || 'carliz-doces'),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'carliz-doces.firebasestorage.app'),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '232159863056'),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID || '1:232159863056:web:9b82a1a594373d4df90595'),
  measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-B1NGLYRF3D'),
}

const isFirebaseAuthConfigured = () => Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.authDomain
  && firebaseConfig.projectId
  && firebaseConfig.appId,
)

const getFirebaseNamespace = () => window.firebase ?? null

const getFirebaseUiNamespace = () => window.firebaseui ?? null

const initializeFirebaseAuth = () => {
  const firebaseNamespace = getFirebaseNamespace()
  if (!firebaseNamespace?.apps || !firebaseNamespace?.initializeApp || !firebaseNamespace?.auth) {
    return null
  }

  if (!firebaseNamespace.apps.length) {
    firebaseNamespace.initializeApp(firebaseConfig)
  }

  return firebaseNamespace.auth()
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
