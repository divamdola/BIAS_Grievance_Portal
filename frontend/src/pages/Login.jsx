import React from 'react';

// An inline SVG icon for the "user"
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// An inline SVG icon for the "lock"
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

function Login() {
  return (
    // Main full-page wrapper
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      {/* The Login Card */}
      <div className="w-full max-w-md transform rounded-xl bg-white p-8 shadow-2xl transition-all">
        {/* Header Section */}
        <div className="text-center">
          {/* Branded Icon (using your logo's color) */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-bias-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6l-9-5v-6l9 5zm0 0v6l9-5v-6l-9 5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Student Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your official college ID
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4 rounded-md shadow-sm">
            {/* Student ID / Email Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon />
              </span>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-bias-blue focus:outline-none focus:ring-bias-blue sm:text-sm"
                placeholder="Student ID or Email"
              />
            </div>
            
            {/* Password Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 pl-10 text-gray-900 placeholder-gray-500 focus:border-bias-blue focus:outline-none focus:ring-bias-blue sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="text-sm text-right">
            <a href="#" className="font-medium text-bias-blue hover:text-bias-darker">
              Forgot your password?
            </a>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-bias-blue py-3 px-4 text-sm font-medium text-white transition-colors hover:bg-bias-darker focus:outline-none focus:ring-2 focus:ring-bias-blue focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-bias-blue hover:text-bias-darker">
            Sign Up Now
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;