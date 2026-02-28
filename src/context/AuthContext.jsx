import { createContext, useContext, useState } from "react";
import * as authService from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  );

  const login = async (data) => {
    const res = await authService.login(data);

    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));

    setUser(res.user);
  };

  const register = async (data) => {
    return await authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
