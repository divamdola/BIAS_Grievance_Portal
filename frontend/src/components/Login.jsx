import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";
import { toast } from 'react-toastify';

const Login = ({ setShowSignup }) => {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // null, 'basic', 'middle', 'super'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      const errorMsg = "Please fill in all fields";
      setError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
      toast.error(result.message);
    } else {
      toast.success("Login successful! Welcome back.");
    }

    setLoading(false);
  };

  // Role Selection Cards Data
  const roleCategories = [
    {
      id: 'basic',
      title: 'Student / Faculty / Staff',
      description: 'Submit and track your grievances',
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-400',
      roles: ['Student', 'Faculty', 'Staff']
    },
    {
      id: 'middle',
      title: 'Middle Level Admin',
      description: 'HOD, Registrar, Chief Hostel Warden',
      icon: '🎯',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:border-purple-400',
      roles: ['HOD', 'Registrar', 'Chief Hostel Warden']
    },
    {
      id: 'super',
      title: 'Super Admin',
      description: 'Director - Full system access',
      icon: '⭐',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:border-red-400',
      roles: ['Director']
    }
  ];

  // Render Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center gap-4">
              <img 
                src={assets.logo} 
                alt="BIAS Logo" 
                className="h-16 w-16 object-contain"
              />
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Birla Institute of Applied Sciences
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Online Grievance Management System
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Welcome to BIAS Portal
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please select your role to continue to the login page
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {roleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedRole(category.id)}
                className={`${category.bgColor} ${category.borderColor} ${category.hoverColor} border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-100 text-left group`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                    <div className="pt-2">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <span>Continue</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-300 w-full">
                    <div className="flex flex-wrap justify-center gap-2">
                      {category.roles.map((role, index) => (
                        <span key={index} className="inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Secure Access</h4>
                <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Quick Response</h4>
                <p className="text-sm text-gray-600">Fast grievance resolution process</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Track Status</h4>
                <p className="text-sm text-gray-600">Real-time complaint tracking</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              © 2025 BIAS Online Grievance System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get selected category info
  const selectedCategory = roleCategories.find(cat => cat.id === selectedRole);

  // Render Login Form Screen
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex bg-white">
        {/* Left side - College Branding */}
        <div className="hidden bg-gray-100 lg:flex lg:w-1/2 min-h-screen items-center justify-center p-12 border-r border-gray-200">
          <div className="text-center bg-gray-100 space-y-8">
            <div className="flex justify-center mb-8">
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

         

            <div className="pt-8 space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-4 text-left">
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
            {/* Back Button */}
            <button
              onClick={() => setSelectedRole(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to role selection</span>
            </button>

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
              
              {/* Selected Role Badge - Mobile */}
              <div className={`${selectedCategory.bgColor} border-2 ${selectedCategory.borderColor} rounded-xl p-4 mt-6 inline-block`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedCategory.icon}</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-600 font-medium">Logging in as</p>
                    <h3 className="text-sm font-bold text-gray-900">{selectedCategory.title}</h3>
                  </div>
                </div>
              </div>
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

              {/* Only show signup link for basic users */}
              {selectedRole === 'basic' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">New to BIAS?</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setShowSignup(true)}
                        className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </>
              )}

              {/* Admin Info for middle and super admins */}
              {(selectedRole === 'middle' || selectedRole === 'super') && (
                <div className="mt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <span className="font-semibold">🔐 Admin Access:</span> Use credentials provided by administration. Contact IT department if you need assistance.
                    </p>
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default Login;