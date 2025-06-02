// filepath: c:\Users\MikeZeroX\Desktop\fresafront\FRESATERRA\src\services\api.js

const baseURL = 'http://127.0.0.1:8000/api/v1'; // Your API base URL

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    // Throw an error that includes the status and the error message from the server
    const error = new Error(errorData.message || 'Something went wrong');
    error.status = response.status;
    error.data = errorData; // Attach full error data
    throw error;
  }
  // If the content type is JSON, parse it, otherwise return as text
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return response.text();
};

const api = {
  get: async (url, options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  post: async (url, data, options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  patch: async (url, data, options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  put: async (url, data, options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
  delete: async (url, options = {}) => {
    const response = await fetch(`${baseURL}${url}`, {
      ...options,
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  // You can add other methods like put, delete, etc., as needed
  // Adding a defaults object to mimic some of axios's structure, though it's not directly used by fetch
  defaults: {
    headers: {
      common: {
        // This is just for structural similarity if other parts of your code expect it.
        // Actual headers are set by getHeaders() per request.
      }
    }
  }
};

// The interceptor concept is handled differently with fetch.
// Token is added directly in getHeaders function.
// For response interceptors (like error handling), it's done in handleResponse.

export default api;
