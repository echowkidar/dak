import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.93.196:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

// export const departments = {
//   search: async (query: string) => {
//     try {
//       const response = await api.get(`/departments?search=${query}`);
//       return response.data;
//     } catch (error: any) {
//       throw error;
//     }
//   },
// };

export const departments = {
  getAll: async () => {
    try {
      const response = await api.get(`/departments`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export const receipts = {
  getAll: async () => {
    try {
      const response = await api.get('/receipts');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/receipts/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  create: async (data: FormData) => {
    try {
      const response = await api.post('/receipts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/receipts/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/receipts/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },


getLatestNumber: async () => {
  try {
    const response = await api.get('/receipts');
    
    // Assuming response.data is an array of receipt objects
    const receipts = response.data;

    if (!Array.isArray(receipts) || receipts.length === 0) {
      throw new Error('No receipts found');
    }

    // Find the receipt with the highest numeric part of `receipt_number`
    const latestReceipt = receipts.reduce((max, receipt) => {
      const currentNumber = parseInt(receipt.receipt_number.split('-')[1], 10); // Extract the number after 'R-'
      const maxNumber = parseInt(max.receipt_number.split('-')[1], 10); // Extract the number after 'R-' for comparison

      return currentNumber > maxNumber ? receipt : max;
    });

    return latestReceipt.receipt_number; // Return the `receipt_number` with the highest value
  } catch (error: any) {
    throw error;
  }
},



getDepartmentName: async () => {
  try {
    const response = await api.get('/receipts');

    // Assuming response.data is an array of receipt objects
    const departmentNames = response.data.map(receipts => receipts.department_name); // Extract department names from each receipt

    // ... (Optional) further processing of department names

    return departmentNames; // Return the array of department names
  } catch (error) {
    console.error('Error fetching department names:', error);
    // Handle the error gracefully (display error message to user)
  }
},
};




export const dispatches = {
  getAll: async () => {
    try {
      const response = await api.get('/dispatches');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/dispatches/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  create: async (data: any) => {
    try {
      const response = await api.post('/dispatches', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  update: async (id: string, data: any) => {
    try {
      const response = await api.put(`/dispatches/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await api.delete(`/dispatches/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  getLatestNumber: async () => {
    try {
      const response = await api.get('/dispatches');
      
      // Assuming response.data is an array of receipt objects
      const dispatches = response.data;
  
      if (!Array.isArray(dispatches) || dispatches.length === 0) {
        throw new Error('No dispatches found');
      }
  
      // Find the receipt with the highest numeric part of `receipt_number`
      const latestDispatch = dispatches.reduce((max, dispatch) => {
        const currentNumber = parseInt(dispatch.dispatch_number.split('-')[1], 10); // Extract the number after 'D-'
        const maxNumber = parseInt(max.dispatch_number.split('-')[1], 10); // Extract the number after 'D-' for comparison
  
        return currentNumber > maxNumber ? dispatch : max;
      });
  
      return latestDispatch.dispatch_number; // Return the `dispatch_number` with the highest value
    } catch (error: any) {
      throw error;
    }
  },
};


api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://10.0.93.196:3000/api/auth/refresh', { token: refreshToken });
        const newToken = response.data.token;

        localStorage.setItem('token', newToken);
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.clear();
        // Redirect to login or handle logout
      }
    }

    return Promise.reject(error);
  }
);