import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function ProtectedRoute({ children }) {
  const username = useUserStore((state) => state.username);
  const isInitialized = useUserStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return children;
}
