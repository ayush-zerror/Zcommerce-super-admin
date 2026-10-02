import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const AUTH_KEY = "zcommerce-admin-auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readAuth(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  const signIn = useCallback((email: string, password: string) => {
    if (!email.trim() || !password.trim()) return false;
    localStorage.setItem(AUTH_KEY, "true");
    setIsAuthenticated(true);
    return true;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, signIn, signOut }),
    [isAuthenticated, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
