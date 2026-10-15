import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, isLoading, isAuthenticated, login, register, logout, getApiError } = context;

  return {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    getApiError,
  };
};

export default useAuth;
