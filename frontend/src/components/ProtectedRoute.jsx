import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/account/login" />;

  return children;
}

export default ProtectedRoute;
