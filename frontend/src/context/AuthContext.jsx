import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      setUser(authService.getCurrentUser());
      setStatus("ready");
    } catch {
      setUser(null);
      setStatus("ready");
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const nextUser = await authService.loginUser(credentials);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (details) => {
    const nextUser = await authService.registerUser(details);
    setUser(nextUser);
    return nextUser;
  });

  const completeProfile = useCallback(
    async (profile) => {
      if (!user) throw new Error("You need to be logged in.");
      const nextUser = await authService.updateUserProfile(user.id, profile);
      setUser(nextUser);
      return nextUser;
    },
    [user],
  );

  const logout = useCallback(() => {
    authService.logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      register,
      completeProfile,
      logout,
    }),
    [user, status, login, register, completeProfile, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
