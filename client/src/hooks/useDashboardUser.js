import { useCallback, useEffect, useState } from "react";
import { fetchCurrentUser } from "@/services/authService";
import { getApiError } from "@/utils/apiError";

/**
 * Fetches the logged-in user profile from GET /api/auth/me for the dashboard.
 */
const useDashboardUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await fetchCurrentUser();
      setUser(data.data.user);
    } catch (fetchError) {
      setUser(null);
      setError(getApiError(fetchError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    error,
    refetch: loadUser,
  };
};

export default useDashboardUser;
