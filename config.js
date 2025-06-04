// config.js - Central configuration for LangCentrix
export const CONFIG = {
  // App Information
  APP_NAME: "LangCentrix",
  APP_DESCRIPTION: "Project Management Tool",
  APP_VERSION: "1.0.0",
  
  // URLs and Routes
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  
  // Protected Routes (routes that require authentication)
  PROTECTED_ROUTES: [
    '/dashboard',
    '/projects',
    '/profile',
    '/settings'
  ],
  
  // Public Routes (accessible without authentication)
  PUBLIC_ROUTES: [
    '/',
    '/login',
    '/signup',
    '/about',
    '/contact'
  ],
  
  // Authentication
  AUTH: {
    LOGIN_REDIRECT: '/dashboard',
    LOGOUT_REDIRECT: '/login',
    SESSION_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  
  // Database
  DATABASE: {
    NAME: 'langcentrix_db',
    COLLECTIONS: {
      USERS: 'users',
      PROJECTS: 'projects',
      TASKS: 'tasks'
    }
  }
};

export default CONFIG;