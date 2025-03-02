import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, useContext } from "react";

const RegisterContext = createContext();

const RegisterProvider = ({ children }) => {
    const navigate = useNavigate();

    const registerAction = async (data) => {
        try {
            const response = await axios.post('http://localhost:8090/register', {
                username: data.username,
                password: data.password
            });
            if (response.data) {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <RegisterContext.Provider value={{ registerAction }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);

export default RegisterProvider;
