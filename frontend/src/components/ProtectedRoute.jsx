import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

export default function ProtectedRoute({ requireProfile = true }) {
  const { user, status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (requireProfile && !user.profile)
    return <Navigate to="/setup-profile" replace />;
  return <Outlet />;
}
