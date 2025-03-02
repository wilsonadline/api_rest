import { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { CartContext } from "../../context/cart";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Footer from "./Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CartStyle = styled.div`
  background-color: #331e38;
  color: #fff;
  text-align: center;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0;
  min-height: 100vh;
  padding: 20px;

  .header-section {
    height: 80vh;
    color: #fff;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("images/bg.png");
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .trends-section {
    padding: 50px 0;
  }

  .trends-section h1 {
    margin: 0;
    font-size: 24px;
    text-align: start;
    padding-left: 50px;
    color: #fff;
  }

  .basket-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .basket-items {
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .basket-item {
    background-color: #706993;
    border-radius: 1rem;
    padding: 1rem;
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
  }

  .item-img {
    width: 15rem;
  }

  .item-details {
    margin-left: 1rem;
    flex-grow: 1;
  }

  .item-details p {
    margin: 0.5rem 0;
  }

  .item-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  select {
    background-color: #331e38;
    width: 2.2rem;
    height: 2rem;
    border-radius: 0.5rem;
    color: white;
  }

  .trash {
    color: white;
  }

  .basket-total-container {
    flex: 1;
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .basket-total {
    background-color: #706993;
    width: 100%;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .basket-total p {
    margin: 0.5rem 0;
  }

  .paiement {
    background-color: #f4e8c1;
    color: black;
    height: 3rem;
    width: 100%;
    margin-top: 1rem;
  }

  .recommande-item img {
    width: 10rem;
  }
`;

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, getCartTotal } = useContext(CartContext);

  useEffect(() => {
    getCart();
  });

  const getCart = async() => {
    // check if cartItems have stock on bdd : 
    // if not, remove item from cartItems
      const promises = cartItems.map(async (item) => {
        try {
          const response = await axios.get(`http://localhost:8090/product/${item.id}`);
          console.log(response.data);
          if (response.data.quantity < item.quantity) {
            removeItem(item);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
    await Promise.all(promises);
  };

  return (
    <>
    <Header />
    <CartStyle>
      <div className="trends-section mb-5">
        <h1>Panier</h1>
        <div className="basket-container">
          <div className="basket-items">
            {cartItems.map((item) => (
              <div className="basket-item" key={item.id}>
                <div>
                  <img className="item-img" src="/images/game.png" alt="game" />
                </div>
                <div className="item-details">
                  <p>{item.name}</p>
                  <p><strong>{item.platform}</strong></p>
                  <div className="item-quantity">
                    <p>{item.price}€</p>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item, e.target.value)}
                    />
                  </div>
                  <button className="btn trash" onClick={() => removeItem(item)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="basket-total-container">
            <div className="basket-total">
              <p><strong>Total: {getCartTotal()}€</strong></p>
              <Link to="/confirmorder"  className="btn paiement">Paiement</Link>
            </div>
          </div>
        </div>
      </div>
    </CartStyle>
      <Footer />
      </>
  );
};

export default Cart;
