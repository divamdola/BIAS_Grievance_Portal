import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import assets from "../assets/assets";

const Signup = ({ setShowSignup }) => {
  const { signup } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.department
    );

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
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
                <p className="font-semibold text-gray-800">Easy Registration</p>
                <p className="text-sm text-gray-600">Quick and simple signup process</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Submit Grievances</p>
                <p className="text-sm text-gray-600">Report issues instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔔</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Get Updates</p>
                <p className="text-sm text-gray-600">Track complaint progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md max-h-[95vh] overflow-y-auto">
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

          {/* Signup Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
              <p className="text-gray-500 text-sm">Register to submit your grievances</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border-l-4 border-red-500 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              {/* Role and Branch in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 cursor-pointer bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-semibold text-gray-700">
                    Branch
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 cursor-pointer bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-gray-50 focus:bg-white"
                  required
                />
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    Create Account
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
                <span className="px-4 bg-white text-gray-500 font-medium">Already registered?</span>
              </div>
            </div>

            {/* Login link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-purple-600 font-bold hover:text-purple-700 hover:underline transition-colors"
                >
                  Login
                </button>
              </p>
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

export default Signup;
