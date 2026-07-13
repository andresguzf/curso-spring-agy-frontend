import { create } from 'zustand';
import type { UserDto, LoginRequest, UserCreateDto } from '../types';
import { authService, userService } from '../services/api';

interface AuthState {
  user: UserDto | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<UserDto>;
  register: (userData: UserCreateDto) => Promise<UserDto>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  checkSession: async () => {
    try {
      const userData = await authService.getMe();
      set({ user: userData });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (credentials: LoginRequest): Promise<UserDto> => {
    set({ loading: true });
    try {
      const userData = await authService.login(credentials);
      set({ user: userData });
      return userData;
    } catch (error) {
      set({ user: null });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (userData: UserCreateDto): Promise<UserDto> => {
    try {
      const newUser = await userService.register(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    set({ loading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, loading: false });
    }
  },

  hasRole: (role: string): boolean => {
    const { user } = get();
    if (!user || !user.roles) return false;
    return user.roles.split(',').map((r) => r.trim()).includes(role);
  },
}));
