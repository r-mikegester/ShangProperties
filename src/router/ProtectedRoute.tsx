import React, { ReactNode, useEffect, useState } from "react";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedEmails: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedEmails }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      // Debug logging
      console.log("Auth state changed:", firebaseUser);
      console.log("Allowed emails:", allowedEmails);
      
      if (!firebaseUser) {
        console.log("No user authenticated, redirecting to home");
        navigate("/", { replace: true });
      } else if (!allowedEmails.includes(firebaseUser.email || "")) {
        console.log("User not authorized, redirecting to home");
        console.log("User email:", firebaseUser.email);
        toast.error("Access denied. Only authorized administrators can access this page.");
        navigate("/", { replace: true });
      } else {
        console.log("User authorized, allowing access");
      }
    });
    
    return () => unsubscribe();
  }, [allowedEmails, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Check if user is authenticated and authorized
  if (!user || !allowedEmails.includes(user.email || "")) {
    // Redirect already handled in useEffect
    return null;
  }

  // If user is allowed, render children
  return <>{children}</>;
};

export default ProtectedRoute;