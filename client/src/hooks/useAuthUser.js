import useAuth from "./useAuth";

const useAuthUser = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
};

export default useAuthUser;