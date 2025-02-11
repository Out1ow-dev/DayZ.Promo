export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginResponse {
  token: string;
  username: string;
} 