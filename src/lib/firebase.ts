import { initializeApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain || 'Missing',
  projectId: firebaseConfig.projectId || 'Missing',
  storageBucket: firebaseConfig.storageBucket || 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId || 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing',
})

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig])

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys)
  throw new Error(`Missing Firebase configuration keys: ${missingKeys.join(', ')}`)
}

let app;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

export { auth, db }
export default app

