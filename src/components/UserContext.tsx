import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, getProfile, login, signUp } from "@/integrations/api/client";

interface UserContextType {
  profile: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  loading: true,
  refresh: () => {},
  logout: () => {},
  login: async () => {},
  signUp: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const getToken = () => localStorage.getItem('token');

  // Save token to localStorage
  const saveToken = (token: string) => localStorage.setItem('token', token);

  // Remove token from localStorage
  const removeToken = () => localStorage.removeItem('token');

  // fetch user profile
  const fetchProfile = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const user = await getProfile(token);
      setProfile(user);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // If token is invalid, clear it
      removeToken();
      setProfile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Load initial profile
    fetchProfile();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { token, user } = await login(email, password);
    saveToken(token);
    setProfile(user);
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    const { token, user } = await signUp(email, password, username);
    saveToken(token);
    setProfile(user);
  };

  const handleLogout = () => {
    removeToken();
    setProfile(null);
  };

  return (
    <UserContext.Provider 
      value={{ 
        profile, 
        loading, 
        refresh: fetchProfile, 
        logout: handleLogout,
        login: handleLogin,
        signUp: handleSignUp
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);

