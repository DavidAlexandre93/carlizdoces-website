const readFirebaseEnvVar = (...envVarNames) => {
  for (const envVarName of envVarNames) {
    const envValue = String(import.meta.env[envVarName] ?? '').trim()
    if (envValue) {
      return envValue
    }
  }

  return ''
}

const projectId = readFirebaseEnvVar('VITE_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID')

const firebaseConfig = {
  apiKey: readFirebaseEnvVar('VITE_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: readFirebaseEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') || (projectId ? `${projectId}.firebaseapp.com` : ''),
  projectId,
  storageBucket: readFirebaseEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') || (projectId ? `${projectId}.appspot.com` : ''),
  messagingSenderId: readFirebaseEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readFirebaseEnvVar('VITE_FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: readFirebaseEnvVar('VITE_FIREBASE_MEASUREMENT_ID', 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
}

const isFirebaseAuthConfigured = () => Boolean(
  firebaseConfig.apiKey
  && (firebaseConfig.authDomain || firebaseConfig.projectId),
)

const getFirebaseModularNamespace = () => window.firebaseModular ?? null

const initializeFirebaseAuth = () => {
  if (!isFirebaseAuthConfigured()) {
    return null
  }

  const firebaseModular = getFirebaseModularNamespace()
  if (!firebaseModular?.initializeApp || !firebaseModular?.getAuth) {
    return null
  }

  try {
    const app = firebaseModular.getApps().length
      ? firebaseModular.getApp()
      : firebaseModular.initializeApp(firebaseConfig)

    return firebaseModular.getAuth(app)
  } catch {
    return null
  }
}

const subscribeToFirebaseUser = (onUserChange) => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseModular = getFirebaseModularNamespace()

  if (!firebaseAuth || !firebaseModular?.onAuthStateChanged) {
    onUserChange(null)
    return () => {}
  }

  return firebaseModular.onAuthStateChanged(firebaseAuth, (user) => {
    onUserChange(user ?? null)
  })
}

const signInWithEmailPassword = async (email, password) => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseModular = getFirebaseModularNamespace()

  if (!firebaseAuth || !firebaseModular?.signInWithEmailAndPassword) {
    throw new Error('firebase-auth-not-configured')
  }

  const userCredential = await firebaseModular.signInWithEmailAndPassword(firebaseAuth, email, password)
  return userCredential.user ?? null
}

const signUpWithEmailPassword = async (email, password) => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseModular = getFirebaseModularNamespace()

  if (!firebaseAuth || !firebaseModular?.createUserWithEmailAndPassword) {
    throw new Error('firebase-auth-not-configured')
  }

  const userCredential = await firebaseModular.createUserWithEmailAndPassword(firebaseAuth, email, password)
  return userCredential.user ?? null
}

const validatePasswordPolicy = async (password) => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseModular = getFirebaseModularNamespace()

  if (!firebaseAuth || !firebaseModular?.validatePassword) {
    return null
  }

  return firebaseModular.validatePassword(firebaseAuth, password)
}

const signOutFirebaseUser = async () => {
  const firebaseAuth = initializeFirebaseAuth()
  const firebaseModular = getFirebaseModularNamespace()

  if (!firebaseAuth || !firebaseModular?.signOut) {
    throw new Error('firebase-auth-not-configured')
  }

  await firebaseModular.signOut(firebaseAuth)
}

export {
  initializeFirebaseAuth,
  isFirebaseAuthConfigured,
  signInWithEmailPassword,
  signOutFirebaseUser,
  signUpWithEmailPassword,
  subscribeToFirebaseUser,
  validatePasswordPolicy,
}
