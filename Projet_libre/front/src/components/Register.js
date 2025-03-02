import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./PROJET_LIBRE_FRONT/Header";
import Footer from "./PROJET_LIBRE_FRONT/Footer";

const Register = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8090/register', {
        username: input.username,
        email: input.email,
        password: input.password
      });
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const styles = {
    body: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#331e38',
      color: '#fff',
    },
    main: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      maxWidth: '400px',
      width: '100%',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#331e38',
      color: '#000',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      margin: '10px 0',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonSecondary: {
      marginTop: '10px',
      padding: '10px 15px',
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    sign_up: {

    }
  };

  return (
    <div style={styles.body}>
      <Header />
      <div style={styles.main}>
        <div style={styles.container}>
          <h1 className="text-white" >Register</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={input.email}
              name="email"
              onChange={handleInput}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={input.username}
              name="username"
              onChange={handleInput}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={input.password}
              name="password"
              onChange={handleInput}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Register</button>
          </form>
          <div className="d-flex justify-content-end">
            <button onClick={() => navigate("/login")} style={styles.sign_up} className="btn text-white">Login</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
