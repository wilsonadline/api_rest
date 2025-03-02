import { useAuth } from "../hooks/AuthProvider";
import axios from "axios";
import Header from '../components/PROJET_LIBRE_FRONT/Header';
import Footer from '../components/PROJET_LIBRE_FRONT/Footer';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from 'styled-components';


const UserDetailsStyle = styled.div`
  background-color: #331e38;
  color: #fff;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  min-height: 80vh;
  padding: 20px;
`;

const DetailsUser = () => {
  const { token } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const { id } = useParams();

  // Get user details
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data);

      // get address of user
      const addressResponse = await axios.get(
        `http://localhost:8090/user/${id}/address`,
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
    } catch (error) {
      console.error(error);
    }
  };

  console.log(userDetails);

  useEffect(() => {
    getUserDetails();
  }, []);

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#331e38',
      color: 'white'
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
      marginBottom: '20px',
    },
    addressList: {
      listStyleType: 'none',
      padding: 0,
    },
    addressItem: {
      padding: '10px 0',
      borderBottom: '1px solid #ddd',
    },
  };

  return (
    <div>
      <Header />
      <UserDetailsStyle>
        <h1>Orders</h1>
        <div style={styles.container}>
          <h1 style={styles.title}>User Details</h1>
          <h2>{userDetails.username}</h2>

          {userDetails.address ? (
            <>
              <h2>Addresses</h2>
              <ul style={styles.addressList}>
                {userDetails.address.map((address) => (
                  <li key={address.id} style={styles.addressItem}>
                    <p><b>Street:</b> {address.street}</p>
                    <p><b>City:</b> {address.city}</p>
                    <p><b>Code postal:</b> {address.postalCode}</p>
                  </li>
                ))}
              </ul>
              <a href="/dashboard" style={styles.button}>Back</a>
            </>
          ) : (
            <h3>Vous n'avez pas la permission de voir les adresses de cet utilisateur.</h3>
          )}
        </div>
      </UserDetailsStyle>
      <Footer />
    </div>
  );
};

export default DetailsUser;
