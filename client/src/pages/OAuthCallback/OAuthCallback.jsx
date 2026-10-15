import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "@/utils/authStorage";
import { ROUTES } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");
    const error = searchParams.get("error");

    if (error) {
      navigate(ROUTES.LOGIN, { 
        replace: true,
        state: { error: `${provider} authentication failed` }
      });
      return;
    }

    if (token) {
      setToken(token);
      
      // Fetch user data with the new token
      fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.data.user);
            navigate(ROUTES.DASHBOARD, { replace: true });
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .catch(err => {
          console.error('OAuth callback error:', err);
          navigate(ROUTES.LOGIN, { 
            replace: true,
            state: { error: 'Authentication failed' }
          });
        });
    } else {
      navigate(ROUTES.LOGIN, { 
        replace: true,
        state: { error: 'No token received' }
      });
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;