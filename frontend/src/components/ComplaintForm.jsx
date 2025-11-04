import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

const ComplaintForm = ({ onClose, onSubmitSuccess }) => {
  const { user, backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "academic",
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

    if (!formData.title || !formData.description) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/complaints/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSubmitSuccess && onSubmitSuccess(data.complaint);
        onClose();
      } else {
        setError(data.message || "Failed to submit complaint");
      }
    } catch (err) {
      setError("Error submitting complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">📝 Submit New Complaint</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border-l-4 border-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-semibold text-gray-800">
              Complaint Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 cursor-pointer bg-white"
              required
            >
              <option value="academic">🏫 Academic (Goes to HOD)</option>
              <option value="hostel">🏠 Hostel (Goes to Warden)</option>
              <option value="staff">🧰 Staff/Worker (Goes to Registrar)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-gray-800">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Brief summary of your complaint"
              value={formData.title}
              onChange={handleChange}
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-800">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your complaint in detail..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="p-3 border-2 border-gray-200 rounded-lg text-base transition-all outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 resize-none"
              required
            ></textarea>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-800">
              <strong>ℹ️ Note:</strong> Your complaint will be automatically routed to the appropriate authority based on the type selected.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 p-3.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg text-base font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-400/40 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-gray-200 text-gray-700 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
