"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserRole = 'school' | 'company' | 'student' | 'platform_admin' | null;

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  schoolId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ mustChangePassword: boolean }>;
  logout: () => void;
  getToken: () => string | null;
  setUser: (user: User | null) => void;
  getAllUsers: () => Promise<User[]>;
  getUsersByRole: (role: string) => Promise<User[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      const parsed = JSON.parse(storedUser);
      const normalizedRole = normalizeRole(parsed.role);
      return {
        ...parsed,
        role: normalizedRole,
      } as User;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const normalizeRole = (role: string | null | undefined): UserRole => {
    if (!role) return null;
    const value = role.toLowerCase();
    if (value.startsWith('school')) return 'school';
    if (value.startsWith('company')) return 'company';
    if (value.startsWith('student')) return 'student';
    if (value.startsWith('platform')) return 'platform_admin';
    return null;
  };

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage au démarrage (si pas encore en état)
    if (!user) {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
      }
    }
    if (user?.role) {
      document.cookie = `stepin_role=${user.role}; path=/; max-age=604800`;
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Remplacer par vrai appel API
      const response = await fetch('http://localhost:8083/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      const userData: User = {
        id: data.userId,
        email: data.email,
        name: data.name,
        role: normalizeRole(data.role),
        companyId: data.companyId,
        schoolId: data.schoolId
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      localStorage.setItem('mustChangePassword', data.mustChangePassword ? 'true' : 'false');
      if (userData.role) {
        document.cookie = `stepin_role=${userData.role}; path=/; max-age=604800`;
      }
      return { mustChangePassword: !!data.mustChangePassword };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = 'stepin_role=; path=/; max-age=0';
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('http://localhost:8083/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.map((user: any) => ({
        id: user.userId,
        email: user.email,
        name: user.email.split('@')[0], // Fallback name from email
        role: normalizeRole(user.role),
        companyId: user.companyId,
        schoolId: user.schoolId
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const getUsersByRole = async (role: string): Promise<User[]> => {
    try {
      const response = await fetch(`http://localhost:8083/users/role/${role.toUpperCase()}`);
      if (!response.ok) throw new Error('Failed to fetch users by role');
      const data = await response.json();
      return data.map((user: any) => ({
        id: user.userId,
        email: user.email,
        name: user.email.split('@')[0],
        role: normalizeRole(user.role),
        companyId: user.companyId,
        schoolId: user.schoolId
      }));
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      getToken,
      setUser,
      getAllUsers,
      getUsersByRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
