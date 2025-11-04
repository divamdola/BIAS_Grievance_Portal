import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const Signup = ({ setShowSignup }) => {
  const { signup } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-purple-800 p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-10 animate-[slideIn_0.4s_ease-out] max-h-[95vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-purple-600 mb-2 font-bold">College Grievance System</h1>
          <h2 className="text-3xl text-gray-800 font-semibold">Create Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border-l-4 border-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-semibold text-gray-800">
              I am a
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 cursor-pointer bg-white"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="department" className="text-sm font-semibold text-gray-800">
              {formData.role === "student" ? "Department/Branch" : "Department"}
            </label>
            <input
              type="text"
              id="department"
              name="department"
              placeholder={
                formData.role === "student"
                  ? "e.g., Computer Science, Mechanical"
                  : "e.g., Administration, Maintenance"
              }
              value={formData.department}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-3 p-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center mt-5">
            <p className="text-sm text-gray-600 my-2">
              Already have an account?{" "}
              <span
                onClick={() => setShowSignup(false)}
                className="text-purple-600 font-semibold cursor-pointer hover:text-purple-800 hover:underline transition-colors"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
