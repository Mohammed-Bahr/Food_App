// API utility for making authenticated requests to the backend
const API_BASE_URL = 'http://localhost:3000';

// Helper function to get the auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API request function with automatic token handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Trigger a page reload to reset auth state
      window.location.href = '/login';
      
      return {
        success: false,
        message: 'Authentication required. Please login again.',
        data: null,
      };
    }

    return {
      success: response.ok,
      message: data.message || '',
      data: data.data || data,
      status: response.status,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: `Network error: ${error.message}`,
      data: null,
    };
  }
};

// Specific HTTP methods
export const api = {
  // GET request
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { method: 'GET', ...options }),

  // POST request
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data), 
      ...options 
    }),

  // PUT request
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data), 
      ...options 
    }),

  // DELETE request
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { method: 'DELETE', ...options }),

  // PATCH request
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(data), 
      ...options 
    }),
};

// Public API requests (no authentication required)
export const publicApi = {
  // Auth endpoints
  login: (credentials) => 
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData) => 
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

export default api;