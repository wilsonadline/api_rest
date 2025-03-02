// Page for managing user addresses by admin

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";
import { useParams } from "react-router-dom";

const AddressManage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const { id } = useParams();

  const getAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:8090/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
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
    buttonDelete: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginBottom: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      border: '1px solid #ddd',
      padding: '8px',
      backgroundColor: '#f2f2f2',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
    },
    actionButton: {
      marginRight: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Espace ADMIN - Address Manage</h1>
      <a href="/admin/dashboard" style={styles.button}>Dashboard Admin</a>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Addresses</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Id</th>
                <th style={styles.th}>Street</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>Country</th>
                <th style={styles.th}>Postal Code</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id}>
                  <td style={styles.td}>{address.id}</td>
                  <td style={styles.td}>{address.street}</td>
                  <td style={styles.td}>{address.city}</td>
                  <td style={styles.td}>{address.postalCode}</td>
                  <td style={styles.td}>{address.country}</td>
                  <td style={styles.td}>
                    <a href={`/admin/user/update/${address.user?.id}`}>
                      {address.user?.username}
                    </a>
                  </td>
                  <td style={styles.td}>
                    <a href={`/admin/address/update/${address.id}`} style={{ ...styles.button, ...styles.actionButton }}>
                      Update
                    </a>
                    <button onClick={() => deleteAddress(address.id)} style={styles.buttonDelete}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AddressManage;
