import { useAuth } from "../hooks/AuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./PROJET_LIBRE_FRONT/Header";
import Footer from "./PROJET_LIBRE_FRONT/Footer";
// import jwtDecode from "jwt-decode";


const Profile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    address: [],
  });

  const [editDetails, setEditDetails] = useState({
    username: "",
    email: "",
    address: [],
  });

  // Déclaration de isAdmin en dehors de la fonction getUserDetails
  const [isAdmin, setIsAdmin] = useState(false);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Mise à jour de isAdmin ici
      setIsAdmin(response.data.role === 'ROLE_ADMIN');

      setUserDetails(response.data);
      setEditDetails(response.data);

      const addressResponse = await axios.get(
        `http://localhost:8090/user/${response.data.id}/address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails((prev) => ({
        ...prev,
        address: addressResponse.data,
      }));
      setEditDetails((prev) => ({
        ...prev,
        address: addressResponse.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8090/user/${userDetails.id}`,
        editDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(response.data);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:8090/user/${userDetails.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:8090/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails((prev) => ({
        ...prev,
        address: prev.address.filter((address) => address.id !== addressId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const styles = {
    body: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#331e39',
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
    main: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
    addressContainer: {
      marginBottom: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#fff',
    },
    addressText: {
      margin: '0 0 10px 0',
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
    deleteButton: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.body}>
    <Header />
    <div style={styles.main}>
      <div style={styles.container} className="w-25">
        <h1 style={styles.title}>Profile</h1>
        <form onSubmit={updateUserDetails} style={styles.form}>
          <div style={styles.formControl}>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={editDetails.username}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Update Profile</button>
        </form>

        {isAdmin && ( 
          <>
          <h2>Commandes passées</h2>
            <a href="/orders" style={styles.linkButton}>Voir mes commandes</a>
            <a href="/admin/users" style={styles.linkButton}>All users</a>
            <a href="/all-products/" style={styles.linkButton}>All products</a>
          </>
        )}

        <button onClick={deleteUser} type="button" style={styles.deleteButton}>Delete my profile</button>

        <div className="d-flex justify-content-end">
          <button onClick={logOut} style={styles.deleteButton}>Déconnexion</button>
        </div>
      </div>

    </div>
    
    <Footer />
    </div>
  );
};

export default Profile;
