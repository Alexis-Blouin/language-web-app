import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useAuth from "../../hooks/useAuth";

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const didLogout = React.useRef(false);

  useEffect(() => {
    if (didLogout.current) return;
    didLogout.current = true;

    const logout = async () => {
      try {
        const res = await axios.post("http://localhost:8081/accounts/logout");
        toast(res.data.message, { theme: "success" });
        setUser(null);
      } catch (error) {
        toast("Logout failed", { theme: "failure" });
      } finally {
        navigate("/account/login");
      }
    };

    logout();
  }, [navigate, setUser]);

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 2,
      }}
    >
      <Typography variant="h4" align="center" sx={{ p: 2 }}>
        Logging out...
      </Typography>
    </Paper>
  );
}

export default Logout;
