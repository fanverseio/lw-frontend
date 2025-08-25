import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      const errorMessage = error || "Authentication failed";
      navigate("/auth?error=" + encodeURIComponent(errorMessage), {
        replace: true,
      });
    }
  }, [navigate, searchParams]);

  return null;
}

export default GoogleCallback;
