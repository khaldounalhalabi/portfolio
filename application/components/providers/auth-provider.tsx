"use client";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  revalidate: () => void;
  logout: () => Promise<void>;
}>({
  user: null,
  isLoading: false,
  revalidate: () => {},
  logout: async () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const result = await supabase.auth.getUser();
      const u = result.data.user;
      setUser(u);

      if (!u) {
        await logout();
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    getUser();
  }, []);

  const revalidate = () => getUser();

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <AuthContext
      value={{
        user,
        revalidate,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  return {
    ...auth,
  };
};

export default AuthProvider;
