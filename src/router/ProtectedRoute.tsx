import React, { ReactNode, useEffect, useState } from "react";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

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
      if (!firebaseUser || !allowedEmails.includes(firebaseUser.email || "")) {
        navigate("/", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [allowedEmails, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not allowed, nothing will render due to redirect
  return <>{children}</>;
};

export default ProtectedRoute;
