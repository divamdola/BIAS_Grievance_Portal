import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";

const Login = ({ setShowSignup }) => {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - College Branding */}
      <div className="hidden bg-gray-100 lg:flex lg:w-1/2  min-h-screen items-center justify-center p-12 border-r border-gray-200">
        <div className="text-center bg-gray-100 space-y-8">
          <div className="flex  justify-center mb-8">
            <img 
              src={assets.logo} 
              alt="College Logo" 
              className="h-56 w-56 object-contain drop-shadow-xl"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight">
              Birla Institute of Applied Sciences
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Online Grievance System
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="pt-8  space-y-4 max-w-md mx-auto">


            <div className="flex  items-center gap-4 text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Secure & Confidential</p>
                <p className="text-sm text-gray-600">Your privacy is our priority</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Quick Resolution</p>
                <p className="text-sm text-gray-600">Fast and efficient response</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Transparent Process</p>
                <p className="text-sm text-gray-600">Track your complaint status</p>
              </div>
            </div>


          </div>

        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo and Header (visible only on mobile) */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-6">
              <img 
                src={assets.logo} 
                alt="College Logo" 
                className="h-24 w-24 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Birla Institute of Applied Sciences
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Online Grievance System
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h3>
              <p className="text-gray-500 text-sm">Please login to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border-l-4 border-red-500 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">New to BIAS?</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Student, Teacher or Worker?{" "}
                <button
                  onClick={() => setShowSignup(true)}
                  className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors"
                >
                  Create Account
                </button>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-semibold">🔐 Admin Users:</span> Director, HOD, Registrar, and Warden should use credentials provided by administration
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              © 2025 BIAS Online Grievance System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
