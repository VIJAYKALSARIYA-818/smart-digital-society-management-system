import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/services/authService";
import { setUnauthorizedHandler } from "@/services/api";
import { ROUTES } from "@/constants/routes";
import { getApiError } from "@/utils/apiError";
import { getToken, removeToken, setToken } from "@/utils/authStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearAuth();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [clearAuth, navigate]);

  const restoreSession = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await fetchCurrentUser();
      setUser(data.data.user);
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);

    return () => setUnauthorizedHandler(null);
  }, [handleUnauthorized]);

  const login = useCallback(
    async (credentials) => {
      const { data } = await loginUser(credentials);
      setToken(data.data.token);
      setUser(data.data.user);
      navigate(ROUTES.DASHBOARD, { replace: true });
      return data;
    },
    [navigate],
  );

  const register = useCallback(
    async (userData) => {
      const { data } = await registerUser(userData);
      setToken(data.data.token);
      setUser(data.data.user);
      navigate(ROUTES.DASHBOARD, { replace: true });
      return data;
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await logoutUser();
      }
    } catch {
      // Continue local logout even if API call fails
    } finally {
      clearAuth();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [clearAuth, navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      getApiError,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
