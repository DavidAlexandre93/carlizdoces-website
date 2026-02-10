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

const signInWithFirebasePopup = async () => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseNamespace = getFirebaseNamespace()
  if (!firebaseAuth || !firebaseNamespace?.auth?.GoogleAuthProvider) {
    throw new Error('firebase-auth-not-available')
  }

  const provider = new firebaseNamespace.auth.GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const credentialResult = await firebaseAuth.signInWithPopup(provider)
  return credentialResult.user ?? null
}

export {
  initializeFirebaseAuth,
  isFirebaseAuthConfigured,
  signInWithFirebasePopup,
  subscribeToFirebaseUser,
}
