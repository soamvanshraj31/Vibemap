// Firebase configuration
const firebaseConfig = {
  // TODO: Add your Firebase configuration here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginToggle = document.getElementById('loginToggle');
const signupToggle = document.getElementById('signupToggle');
const googleSignIn = document.getElementById('googleSignIn');
const facebookSignIn = document.getElementById('facebookSignIn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');
const alertModal = document.getElementById('alertModal');
const alertMessage = document.getElementById('alertMessage');

// Form toggle functionality
loginToggle.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  loginToggle.classList.add('text-violet-600', 'border-violet-600');
  signupToggle.classList.remove('text-violet-600', 'border-violet-600');
});

signupToggle.addEventListener('click', () => {
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupToggle.classList.add('text-violet-600', 'border-violet-600');
  loginToggle.classList.remove('text-violet-600', 'border-violet-600');
});

// Show alert message
function showAlert(message, isError = false) {
  alertMessage.textContent = message;
  alertModal.classList.remove('hidden');
  alertModal.classList.add(isError ? 'bg-red-100' : 'bg-green-100');
  setTimeout(() => {
    alertModal.classList.add('hidden');
  }, 3000);
}

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    showAlert('Successfully logged in!');
    // Redirect to dashboard or home page
    window.location.href = '/dashboard';
  } catch (error) {
    showAlert(error.message, true);
  }
});

// Email/Password Sign Up
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  const confirmPassword = signupForm.confirmPassword.value;

  if (password !== confirmPassword) {
    showAlert('Passwords do not match!', true);
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    showAlert('Account created successfully!');
    // Redirect to dashboard or home page
    window.location.href = '/dashboard';
  } catch (error) {
    showAlert(error.message, true);
  }
});

// Google Sign In
googleSignIn.addEventListener('click', async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    showAlert('Successfully logged in with Google!');
    // Redirect to dashboard or home page
    window.location.href = '/dashboard';
  } catch (error) {
    showAlert(error.message, true);
  }
});

// Facebook Sign In
facebookSignIn.addEventListener('click', async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    showAlert('Successfully logged in with Facebook!');
    // Redirect to dashboard or home page
    window.location.href = '/dashboard';
  } catch (error) {
    showAlert(error.message, true);
  }
});

// Password Reset
resetPasswordBtn.addEventListener('click', async () => {
  const email = loginForm.email.value;
  if (!email) {
    showAlert('Please enter your email address first!', true);
    return;
  }

  try {
    await auth.sendPasswordResetEmail(email);
    showAlert('Password reset email sent! Please check your inbox.');
  } catch (error) {
    showAlert(error.message, true);
  }
});

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user.email);
    // You can update UI elements here
  } else {
    // User is signed out
    console.log('User is signed out');
    // You can update UI elements here
  }
});

// Form validation
function validateForm(form) {
  const email = form.email.value;
  const password = form.password.value;
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert('Please enter a valid email address!', true);
    return false;
  }

  // Password validation
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters long!', true);
    return false;
  }

  return true;
}

// Add form validation before submission
loginForm.addEventListener('submit', (e) => {
  if (!validateForm(loginForm)) {
    e.preventDefault();
  }
});

signupForm.addEventListener('submit', (e) => {
  if (!validateForm(signupForm)) {
    e.preventDefault();
  }
}); 