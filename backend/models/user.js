import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["student", "faculty", "staff", "hod", "chief_hostel_warden", "registrar", "director"],
    required: true
  },
  department: String,
});

export default mongoose.model("User", userSchema);