import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import Header from "./PROJET_LIBRE_FRONT/Header";
import Footer from "./PROJET_LIBRE_FRONT/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8090/authenticate", {
        email,
        password,
      });
      console.log("Response data:", response.data);
      setToken(response.data.token);
      if (response.data.token) {
        navigate("/profile");
      } else {
        setError("Token not received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const styles = {
    body: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#331e39',
    },
    main: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      maxWidth: '400px',
      padding: '20px',
      border: '1px solid white',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#331e38',
      color: 'white'
    },
    title: {
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    formControl: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '10px',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '5px 0',
    },
    error: {
      color: 'red',
      marginBottom: '10px',
    },
    sign_in: {
      color: 'white'
    }
  };

  return (
    <div style={styles.body}>
      <Header />
      <div style={styles.main}>
        <div style={styles.container}>
          <h1 style={styles.title}>Login</h1>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.formControl}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formControl}>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Login</button>
          </form>
          <div className="d-flex justify-content-end">
            <button style={styles.sign_in} className="btn" onClick={handleSignUp}>Sign In</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
