import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAddresseUser = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState([]);
  const { id } = useParams();

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
      navigate("/profile");
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
    linkButton: {
      padding: '10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginRight: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Update Address</h1>
      <a href="/profile" style={styles.linkButton}>Profile</a>
      <br />
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={updateAddress} style={styles.form}>
          <div style={styles.formControl}>
            <label htmlFor="street">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formControl}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formControl}>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
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

export default UpdateAddresseUser;
