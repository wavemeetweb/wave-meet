// Your web app's Firebase configuration (get from Firebase Console)
const firebaseConfig = {
  apiKey: "<YOUR-API-KEY>",
  authDomain: "<YOUR-PROJECT>.firebaseapp.com",
  projectId: "wave-meett",
  storageBucket: "<YOUR-PROJECT>.appspot.com",
  messagingSenderId: "866825007815",
  appId: "<APP-ID>"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Email/password signup
async function signUp(email, password, name, birthdate) {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  await userCredential.user.updateProfile({ displayName: name });
  // You can save birthdate in Firestore if needed
  return userCredential.user;
}

// Email/password login
async function login(email, password) {
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  return userCredential.user;
}

// Google login
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await auth.signInWithPopup(provider);
  return result.user;
}

// Facebook login
async function signInWithFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  const result = await auth.signInWithPopup(provider);
  return result.user;
}

// Logout
async function logout() {
  await auth.signOut();
}
