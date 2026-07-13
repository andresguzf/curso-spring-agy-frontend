import axios from 'axios';
import type { LoginRequest, UserCreateDto, UserDto, CustomerDto } from '../types';

const api = axios.create({
  baseURL: '', // Uses the dev proxy in vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending and receiving HttpOnly JWT cookies
});

// Authentication Services
export const authService = {
  login: async (credentials: LoginRequest): Promise<UserDto> => {
    const response = await api.post<UserDto>('/api/auth/login', credentials);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
  getMe: async (): Promise<UserDto> => {
    const response = await api.get<UserDto>('/api/auth/me');
    return response.data;
  },
};

// User Services
export const userService = {
  register: async (user: UserCreateDto): Promise<UserDto> => {
    const response = await api.post<UserDto>('/api/users', user);
    return response.data;
  },
  getAll: async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/api/users');
    return response.data;
  },
  update: async (id: number, user: UserCreateDto): Promise<UserDto> => {
    const response = await api.put<UserDto>(`/api/users/${id}`, user);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/users/${id}`);
  },
};

// Customer Services
export const customerService = {
  getAll: async (): Promise<CustomerDto[]> => {
    const response = await api.get<CustomerDto[]>('/api/customers');
    return response.data;
  },
  create: async (customer: CustomerDto): Promise<CustomerDto> => {
    const response = await api.post<CustomerDto>('/api/customers', customer);
    return response.data;
  },
  update: async (id: number, customer: CustomerDto): Promise<CustomerDto> => {
    const response = await api.put<CustomerDto>(`/api/customers/${id}`, customer);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/customers/${id}`);
  },
};

export default api;
