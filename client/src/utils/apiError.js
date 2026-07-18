/**
 * Extracts a user-friendly error message from an Axios/API error response.
 * @param {unknown} error - Axios error object
 * @returns {{ message: string, errors: string[] }}
 */
export const getApiError = (error) => {
  const responseData = error?.response?.data;

  if (!responseData) {
    return {
      message: error?.message || "Something went wrong. Please try again.",
      errors: [],
    };
  }

  const errors = Array.isArray(responseData.errors) ? responseData.errors : [];

  return {
    message: responseData.message || "Something went wrong. Please try again.",
    errors,
  };
};
