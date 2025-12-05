// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const auth = async () => {
    // Check if a token exists
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    // If token exists, we assume they are authorized
    setIsAuthorized(true);
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;