// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, 
  signOut as firebaseSignOut, 
  updateProfile,
  browserLocalPersistence,
  setPersistence
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  serverTimestamp, 
  updateDoc,
  enableIndexedDbPersistence, 
  writeBatch,
  connectFirestoreEmulator 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyS_iDrdKipKVfpKr2HhWFoKzbuu1qdeQ",
  authDomain: "vibecheck-dad8a.firebaseapp.com",
  projectId: "vibecheck-dad8a",
  storageBucket: "vibecheck-dad8a.appspot.com",
  messagingSenderId: "201511764257",
  appId: "1:201511764257:web:df282b57230ff9babc7e60"
};

let app;
let auth;
let db;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Set persistent auth state
  await setPersistence(auth, browserLocalPersistence);

  // Enable offline persistence with error handling
  await enableIndexedDbPersistence(db, {
    synchronizeTabs: true
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    } else {
      console.error('Persistence error:', err);
      // Show error notification
      showNotification('Database connection error. Some features may be limited.', 'error');
    }
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  showNotification('Error initializing app. Please refresh the page.', 'error');
}

// Utility function to show notifications
function showNotification(message, type = 'error') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === 'error' ? 'bg-red-500' : 'bg-green-500'
  } text-white`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Authentication state observer with error handling
onAuthStateChanged(auth, async (user) => {
  try {
    if (user) {
      console.log('User is signed in:', user.uid);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      // Update last login timestamp
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating last login:', error);
      }

      // Redirect to main page if on login/signup page
      if (window.location.pathname.includes('login.html') || 
          window.location.pathname.includes('signup.html')) {
        window.location.href = 'index11.html';
      }
    } else {
      console.log('User is signed out');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      const allowedPaths = ['/login.html', '/signup.html', '/index11.html'];
      const currentPath = window.location.pathname;
      
      if (!allowedPaths.some(path => currentPath.endsWith(path))) {
        window.location.href = 'login.html';
      }
    }
  } catch (error) {
    console.error('Auth state change error:', error);
    showNotification('Authentication error. Please try again.', 'error');
  }
}, (error) => {
  console.error('Auth state observer error:', error);
  showNotification('Authentication error. Please refresh the page.', 'error');
});

// Enhanced error handling for Firestore operations
async function handleFirestoreOperation(operation, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      // Check if error is retryable
      if (error.code === 'permission-denied' || 
          error.code === 'unauthenticated') {
        // Redirect to login page for auth errors
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying operation... (${attempt + 2}/${maxRetries})`);
      }
    }
  }
  
  // Show error notification on final failure
  showNotification('Operation failed. Please try again.', 'error');
  throw lastError;
}

// Create user document with batch write
async function createUserDocument(uid, userData) {
  const batch = writeBatch(db);
  
  // Main user document
  const userRef = doc(db, 'users', uid);
  batch.set(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  });
  
  // Default subcollections
  const savedPlacesRef = doc(db, 'users', uid, 'savedPlaces', 'default');
  batch.set(savedPlacesRef, {
    createdAt: serverTimestamp(),
    places: []
  });
  
  const activityRef = doc(db, 'users', uid, 'activity', 'default');
  batch.set(activityRef, {
    createdAt: serverTimestamp(),
    activities: []
  });
  
  try {
    await batch.commit();
    console.log('User document created successfully');
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

// Sign in with email and password
export async function signInWithEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful');
    
    // Update last login with retry mechanism
    await updateLastLogin(userCredential.user.uid);
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('Sign in error:', error);
    let errorMessage;
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later.';
        break;
      default:
        errorMessage = 'An error occurred during sign in.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if this is a new user
    const isNewUser = result._tokenResponse.isNewUser;
    console.log('Is new Google user:', isNewUser);
    
    if (isNewUser) {
      // Create user document for new Google sign-ins
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profile: {
          firstName: result.user.displayName.split(' ')[0],
          lastName: result.user.displayName.split(' ').slice(1).join(' '),
          bio: '',
          location: '',
          phoneNumber: ''
        },
        preferences: {
          notifications: true,
          theme: 'dark',
          language: 'en',
          emailNotifications: true
        },
        stats: {
          totalVibes: 0,
          placesVisited: 0,
          reviewsWritten: 0,
          photosUploaded: 0
        },
        social: {
          followers: 0,
          following: 0,
          likes: 0
        },
        settings: {
          privacyLevel: 'public',
          showLocation: true,
          showActivity: true
        }
      });
      console.log('Created new user document for Google sign-in');

      // Create default subcollections
      await setDoc(doc(db, 'users', result.user.uid, 'savedPlaces', 'default'), {
        createdAt: serverTimestamp(),
        places: []
      });
      await setDoc(doc(db, 'users', result.user.uid, 'activity', 'default'), {
        createdAt: serverTimestamp(),
        activities: []
      });
    } else {
      // Update last login for existing users
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      });
    }
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    return { success: false, error: error.message };
  }
}

// Sign in with Facebook
export async function signInWithFacebook() {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if this is a new user
    const isNewUser = result._tokenResponse.isNewUser;
    console.log('Is new Facebook user:', isNewUser);
    
    if (isNewUser) {
      // Create user document for new Facebook sign-ins
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profile: {
          firstName: result.user.displayName.split(' ')[0],
          lastName: result.user.displayName.split(' ').slice(1).join(' '),
          bio: '',
          location: '',
          phoneNumber: ''
        },
        preferences: {
          notifications: true,
          theme: 'dark',
          language: 'en',
          emailNotifications: true
        },
        stats: {
          totalVibes: 0,
          placesVisited: 0,
          reviewsWritten: 0,
          photosUploaded: 0
        },
        social: {
          followers: 0,
          following: 0,
          likes: 0
        },
        settings: {
          privacyLevel: 'public',
          showLocation: true,
          showActivity: true
        }
      });
      console.log('Created new user document for Facebook sign-in');

      // Create default subcollections
      await setDoc(doc(db, 'users', result.user.uid, 'savedPlaces', 'default'), {
        createdAt: serverTimestamp(),
        places: []
      });
      await setDoc(doc(db, 'users', result.user.uid, 'activity', 'default'), {
        createdAt: serverTimestamp(),
        activities: []
      });
    } else {
      // Update last login for existing users
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp()
      });
    }
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Error in signInWithFacebook:', error);
    return { success: false, error: error.message };
  }
}

// Sign up with email and password
export async function signUpWithEmailPassword(email, password, displayName) {
  try {
    console.log('Starting signup process');
    
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Create user document with retry mechanism
    await handleFirestoreOperation(async () => {
      await createUserDocument(user.uid, {
        uid: user.uid,
        email,
        displayName,
        profile: {
          firstName: displayName.split(' ')[0],
          lastName: displayName.split(' ').slice(1).join(' '),
          photoURL: null,
          bio: '',
          location: '',
          phoneNumber: ''
        },
        preferences: {
          notifications: true,
          theme: 'dark',
          language: 'en',
          emailNotifications: true
        },
        stats: {
          totalVibes: 0,
          placesVisited: 0,
          reviewsWritten: 0,
          photosUploaded: 0
        },
        social: {
          followers: 0,
          following: 0,
          likes: 0
        },
        settings: {
          privacyLevel: 'public',
          showLocation: true,
          showActivity: true
        }
      });
    });

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    let errorMessage;
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection.';
        break;
      default:
        errorMessage = `Sign up failed: ${error.message}`;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

// Sign out
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
}

// Update user profile
export async function updateUserProfile(updates) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is signed in');

    // Update auth profile if display name or photo URL is being updated
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName || user.displayName,
        photoURL: updates.photoURL || user.photoURL
      });
    }

    // Update user document in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset:', error);
    return { 
      success: false, 
      error: error.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : error.message 
    };
  }
}

// Update UI based on auth state
function updateUIForUser(user) {
  const userMenus = document.querySelectorAll('.user-menu');
  const loginButtons = document.querySelectorAll('.login-button');
  const signupButtons = document.querySelectorAll('.signup-button');
  
  if (user) {
    userMenus.forEach(menu => {
      menu.classList.remove('hidden');
      const userImage = menu.querySelector('.user-image');
      const userName = menu.querySelector('.user-name');
      if (userImage) userImage.src = user.photoURL || 'assets/default-avatar.png';
      if (userName) userName.textContent = user.displayName || user.email;
    });
    loginButtons.forEach(button => button.classList.add('hidden'));
    signupButtons.forEach(button => button.classList.add('hidden'));
  } else {
    userMenus.forEach(menu => menu.classList.add('hidden'));
    loginButtons.forEach(button => button.classList.remove('hidden'));
    signupButtons.forEach(button => button.classList.remove('hidden'));
  }
}

// Export necessary functions and objects
export {
  auth,
  db,
  signInWithEmailPassword,
  signInWithGoogle,
  signInWithFacebook,
  signUpWithEmailPassword,
  resetPassword,
  signOutUser,
  updateUserProfile
}; 