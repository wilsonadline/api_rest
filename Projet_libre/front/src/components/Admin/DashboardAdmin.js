import { useAuth } from "../../hooks/AuthProvider";
import { useState, useEffect } from "react";
import axios from "axios";

const DashboardAdmin = () => {
  const { user, logOut } = useAuth();

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
    logoutButton: {
      padding: '10px 15px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      marginTop: '20px',
    },
    address: {
      display: 'flex',
      flexDirection: 'row',
        gap: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue sur l'espace Admin - {user?.username}</h1>
      <a href="/profile" style={styles.button}>Profile</a>
      <br />
      <a href="/admin/users" style={styles.button}>Users Manage</a>
      <br />
      <div style={styles.address}>
        <a href="/admin/address" style={styles.button}>Address Manage</a>
        <br />
        <a href="/address/add" style={styles.button}>Add Address</a>
      </div>
      <br />
      <button onClick={logOut} style={styles.logoutButton}>Logout</button>
    </div>
  );
}

export default DashboardAdmin;
