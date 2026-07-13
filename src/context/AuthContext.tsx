import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserDto, LoginRequest, UserCreateDto } from '../types';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<UserDto>;
  register: (user: UserCreateDto) => Promise<UserDto>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (credentials: LoginRequest): Promise<UserDto> => {
    setLoading(true);
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserCreateDto): Promise<UserDto> => {
    try {
      // In our design, registration is public
      const newUser = await userService.register(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    // Roles in backend come as a comma-separated string, e.g. "ROLE_USER,ROLE_ADMIN"
    return user.roles.split(',').map(r => r.trim()).includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkSession,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
