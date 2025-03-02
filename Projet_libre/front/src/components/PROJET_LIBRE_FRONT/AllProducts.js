import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useAuth } from '../../hooks/AuthProvider';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';

const ProductsStyle = styled.div`
  background-color: #331e38;
  color: #fff;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  min-height: 80vh;
  padding: 20px;
`;

const Products = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/product/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <ProductsStyle>
        <h1>Products</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="table-responsive d-flex justify-content-center">
            <table className="table table-striped text-white  w-75">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}€</td>
                    <td>{product.description}</td>
                    <td>{product.quantity}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ProductsStyle>
      <Footer />
    </div>
  );
}

export default Products;
  