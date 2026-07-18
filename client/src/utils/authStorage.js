const AUTH_TOKEN_KEY = "sdsms_auth_token";

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
