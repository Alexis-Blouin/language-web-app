import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-simple-toasts";
import { useRef } from "react";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const toastShown = useRef(false);

  if (loading) return <CircularProgress />;
  if (!user) {
    if (!toastShown.current) {
      toast("Please login before accessing the other pages", {
        theme: "info",
      });
      toastShown.current = true;
    }
    return <Navigate to="/account/login" />;
  }

  return children;
}

export default ProtectedRoute;
