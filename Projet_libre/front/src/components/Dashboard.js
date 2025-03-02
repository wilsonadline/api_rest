import { useAuth } from "../hooks/AuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from '../components/PROJET_LIBRE_FRONT/Header';
import Footer from '../components/PROJET_LIBRE_FRONT/Footer';
import styled from 'styled-components';

const Dashboard = () => {
  const user = useAuth();
  const [users, setUsers] = useState([]);
  const { logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get all users
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8090/user", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const AllUsersStyle = styled.div`
    background-color: #331e38;
    color: #fff;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    min-height: 80vh;
    padding: 20px;
  `;

  const styles = {
    body: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#331e39',
    },
    container: {
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#331e39',
    },
    welcomeText: {
      marginBottom: '20px',
    },
    userList: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
      marginBottom: '10px',
    },
    link: {
      color: '#007bff',
    },
    linkuser: {
      color: '#007bff',
      textDecoration: 'none',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonaddress: {
      padding: '10px 15px 10px 15px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };

  return (
    <div>
      <Header />
      <AllUsersStyle>
        <div style={styles.container}>
          <h1 style={styles.welcomeText}>Bienvenue - {user.user?.username} </h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <div className="table-responsive d-flex flex-column justify-content-center align-items-center">
              <h2>Users</h2>
              <table className="table table-striped text-white  w-75">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userdata) => (
                    <tr key={userdata.id}>
                      <td>{userdata.id}</td>
                      <td>
                        <a href={`/user/${userdata.id}`} style={styles.linkuser}>{userdata.username}</a>
                      </td>
                      <td>
                        <button className="btn btn-outline-primary mx-1">update</button>
                        <button className="btn btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AllUsersStyle>
      <Footer />
    </div>
  );
};

export default Dashboard;
