import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem("site");
    return storedData ? JSON.parse(storedData).user : null;
  });

  const [token, setTokenState] = useState(() => {
    const storedData = localStorage.getItem("site");
    return storedData ? JSON.parse(storedData).token : "";
  });

  const setToken = (newToken) => {
    setTokenState(newToken);
    const storedData = localStorage.getItem("site");
    const userData = storedData ? JSON.parse(storedData).user : null;
    localStorage.setItem("site", JSON.stringify({ user: userData, token: newToken }));
  };

  useEffect(() => {
    const storedData = localStorage.getItem("site");
    if (storedData) {
      const { user, token } = JSON.parse(storedData);
      setUser(user);
      setTokenState(token);
    }
  }, []);

  const loginAction = async (data) => {
    try {
      const response = await axios.post('http://localhost:8090/authenticate', {
        email: data.email,
        password: data.password
      });
      console.log("Login successful:", response.data);

      
      if (response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("site", JSON.stringify({ user, token }));
        navigate("/profile"); 
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logOut = () => {
    setUser(null);
    setTokenState("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const { token, ...rest } = useContext(AuthContext);
  const isAuthenticated = !!token;
  return { token, isAuthenticated, ...rest };
};
