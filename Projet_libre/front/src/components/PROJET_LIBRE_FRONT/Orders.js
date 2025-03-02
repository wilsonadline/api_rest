import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useAuth } from '../../hooks/AuthProvider';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const OrdersStyle = styled.div`
  background-color: #331e38;
  color: #fff;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  min-height: 80vh;
  padding: 20px;
`;

const Orders = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersUser();
  }, []);

  const getOrdersUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/order/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <OrdersStyle>
        <h1>Orders</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="table-responsive d-flex justify-content-center">
            <table className="table table-striped text-white  w-75">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Products</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.total_price}€</td>
                    <td>{order.status}</td>
                    <td>
                      <ul>
                        {order.products.map((product) => (
                          <li key={product.id}>
                            {product.name} x {product.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OrdersStyle>
      <Footer />
    </div>
  );
}

export default Orders;
