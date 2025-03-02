import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useParams } from "react-router-dom";

const UpdateUser = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const { id } = useParams();

  const getUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8090/user/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("User updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    title: {
      marginBottom: '20px',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginBottom: '10px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    submitButton: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Espace ADMIN - Update User</h1>
      <a href="/admin/dashboard" style={styles.button}>Dashboard Admin</a>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={updateUser}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="role" style={styles.label}>Role</label>
            <select
              name="role"
              id="role"
              value={userData.role}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="ROLE_USER">ROLE_USER</option>
              <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton}>Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateUser;
