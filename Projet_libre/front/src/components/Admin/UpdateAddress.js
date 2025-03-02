import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAddress = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

  const getAddress = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddress(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  const updateAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8090/address/${id}`, address, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAddress();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
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
      textAlign: 'center',
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
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '8px',
      boxSizing: 'border-box',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Espace ADMIN - Update Address</h1>
      <a href="/admin/address" style={styles.button}>Address Manage</a>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={updateAddress}>
          <div style={styles.formGroup}>
            <label htmlFor="street" style={styles.label}>Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="city" style={styles.label}>City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="country" style={styles.label}>Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="postalCode" style={styles.label}>Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={address.postalCode || ''}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Update</button>
        </form>
      )}
    </div>
  );
};

export default UpdateAddress;
