page.js
import Link from 'next/link';
import CONFIG from '../../config.js';

export default function Home() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      
      {/* Left side - info panel */}
      <div className="w-1/2 flex flex-col justify-center px-20 bg-indigo-50">
        <h1 className="text-6xl font-extrabold text-indigo-900 mb-6 leading-tight drop-shadow-md">
          Welcome to {CONFIG.APP_NAME}
        </h1>
        <p className="text-xl text-indigo-700 max-w-md tracking-wide">
          {CONFIG.APP_DESCRIPTION} - Streamline your workflow and boost productivity
        </p>
      </div>
      
      {/* Right side - login panel */}
      <div className="w-1/2 flex flex-col justify-center items-center px-20 bg-white shadow-lg">
        <h2 className="text-4xl font-semibold text-indigo-900 mb-10">Sign In</h2>
        
        <Link 
          href="/login"
          className="w-full max-w-sm bg-indigo-600 text-white py-4 rounded-xl font-semibold text-center shadow hover:bg-indigo-700 transition"
        >
          Go to Login
        </Link>
        
        <p className="mt-8 text-indigo-600">
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="text-indigo-700 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}