import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useState } from "react";
import { toast } from "react-toastify";

const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("User signed in:", user);
      
      // Check if user is authorized
      const allowedEmails = [
        'guidetoshangproperties@gmail.com',
        'mikegester.sabuga023@gmail.com'
      ];
      
      if (!allowedEmails.includes(user.email || '')) {
        // User is authenticated but not authorized
        toast.error("Access denied. Only authorized administrators can access this page.");
        // Sign out the user since they're not authorized
        await auth.signOut();
        // Redirect to home page
        navigate("/", { replace: true });
        return;
      }
      
      // Log the login event
      await addDoc(collection(db, "adminLogs"), {
        type: "login",
        userId: user.uid,
        email: user.email,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });
      
      // Show success message
      toast.success("Login successful!");
      
      // Redirect to admin dashboard after successful login
      console.log("Redirecting to dashboard...");
      navigate("/Admin/Dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      toast.error("Login failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <div className="w-full max-w-fit bg-white rounded-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 castoro-titling-regular text-[#b08b2e]">Sign in to Dashboard</h1>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg bg-[#b08b2e] hover:bg-[#8a6c1d] text-white font-semibold castoro-titling-regular text-lg transition mb-4"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.69 30.77 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z" /><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.6C43.93 37.13 46.1 31.36 46.1 24.55z" /><path fill="#FBBC05" d="M10.67 28.09a14.5 14.5 0 0 1 0-8.18l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.56l7.98-6.2z" /><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.14 15.9-5.82l-7.19-5.6c-2 1.36-4.56 2.17-8.71 2.17-6.38 0-11.87-3.59-14.33-8.74l-7.98 6.2C6.71 42.52 14.82 48 24 48z" /><path fill="none" d="M0 0h48v48H0z" /></g></svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>Only authorized administrators can access the dashboard.</p>
          <p className="mt-2">Authorized emails:</p>
          <p>guidetoshangproperties@gmail.com</p>
          <p>mikegester.sabuga023@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;