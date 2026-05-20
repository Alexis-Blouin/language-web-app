import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-simple-toasts";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastShown = useRef(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/accounts/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        if (!toastShown.current) {
          toast("Please login before accessing the other pages", {
            theme: "info",
          });
          toastShown.current = true;
        }
      }) // 401 = not logged in
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

export default useAuth;
