import React, { useContext, useState } from "react";
import { AppContext } from "./context/AppContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import DirectorDashboard from "./components/DirectorDashboard";
import MediumLevelDashboard from "./components/MediumLevelDashboard";
import LowLevelDashboard from "./components/LowLevelDashboard";

const App = () => {
  const { user, loading } = useContext(AppContext);
  const [showSignup, setShowSignup] = useState(false);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "24px",
        color: "#667eea"
      }}>
        Loading...
      </div>
    );
  }

  // If user is not logged in, show Login or Signup form
  if (!user) {
    return showSignup ? (
      <Signup setShowSignup={setShowSignup} />
    ) : (
      <Login setShowSignup={setShowSignup} />
    );
  }

  // Dynamic dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case "director":
        return <DirectorDashboard />;
      
      case "hod":
      case "registrar":
      case "warden":
        return <MediumLevelDashboard />;
      
      case "student":
      case "teacher":
      case "worker":
        return <LowLevelDashboard />;
      
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h2>Invalid user role</h2>
          </div>
        );
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default App;
