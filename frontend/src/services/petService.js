import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const petService = {
  // Get all pets with filters and pagination
  getPets: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/pets?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pets' };
    }
  },

  // Get featured pets
  getFeaturedPets: async () => {
    try {
      const response = await api.get('/pets/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured pets' };
    }
  },

  // Get single pet by ID
  getPetById: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pet details' };
    }
  },

  // Get similar pets
  getSimilarPets: async (id) => {
    try {
      const response = await api.get(`/pets/${id}/similar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch similar pets' };
    }
  },

  // Admin: Create pet
  createPet: async (petData) => {
    try {
      const response = await api.post('/pets', petData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create pet' };
    }
  },

  // Admin: Update pet
  updatePet: async (id, petData) => {
    try {
      const response = await api.put(`/pets/${id}`, petData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update pet' };
    }
  },

  // Admin: Delete pet
  deletePet: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete pet' };
    }
  }
};

export default petService;