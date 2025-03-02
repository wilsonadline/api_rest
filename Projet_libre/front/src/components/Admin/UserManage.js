import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthProvider";

const UserManage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get all users
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8090/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8090/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
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
    userList: {
      listStyleType: 'none',
      padding: 0,
    },
    userListItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #ccc',
    },
    deleteButton: {
      padding: '5px 10px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Espace ADMIN - Users</h1>
      <a href="/admin/dashboard" style={styles.button}>Dashboard Admin</a>

      {loading && <p>Loading...</p>}
      <ul style={styles.userList}>
        {users.map((userdata) => (
          <li key={userdata.id} style={styles.userListItem}>
            <a href={`/admin/user/update/${userdata.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
              {userdata.username}
            </a>
            <button onClick={() => deleteUser(userdata.id)} style={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManage;
