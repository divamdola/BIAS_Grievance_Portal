import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 to-purple-800 p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-10 animate-[slideIn_0.4s_ease-out]">
        <div className="text-center mb-8">
          <h1 className="text-2xl text-purple-600 mb-2 font-bold">College Grievance System</h1>
          <h2 className="text-3xl text-gray-800 font-semibold">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border-l-4 border-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-3 p-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-5">
            <p className="text-sm text-gray-600 my-2">
              Student, Teacher or Worker?{" "}
              <span
                onClick={() => setShowSignup(true)}
                className="text-purple-600 font-semibold cursor-pointer hover:text-purple-800 hover:underline transition-colors"
              >
                Create Account
              </span>
            </p>
            <p className="text-xs text-gray-500 italic mt-3">
              Admin users (Director, HOD, Registrar, Warden) - use credentials provided by administration
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
