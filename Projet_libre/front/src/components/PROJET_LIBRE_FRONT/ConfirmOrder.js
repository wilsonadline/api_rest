import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { CartContext } from "../../context/cart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import Footer from "./Footer";
import styled from "styled-components";

const ConfirmOrder = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const navigate = useNavigate();
  const { token } = useAuth();
  const [userData, setUserData] = useState([]);
  // useEffect(() => {
    // const fetchAddresses = async () => {
    //   if (!user) return;
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:5000/api/addresses/${user.id}`
    //     );
    //     if (response.status === 200) {
    //       setAddresses(response.data);
    //       // Sélectionner la première adresse par défaut
    //       if (response.data.length > 0) {
    //         setSelectedAddress(response.data[0].id);
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // fetchAddresses();
  // }, [user.id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    console.log("token: ", user);
    try {
      const response = await axios.get(`http://localhost:8090/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      console.log(response);
      setUserData(response);
    } catch {
      console.log("error");
    }
    const order = {
        user: userData.id,
        address: selectedAddress || newAddress,
        products: cartItems.map((product) => ({
            product_id: product.id,
            quantity: product.quantity,
        })),
    };
    try {
        const responseOrder = await axios.post(
            `http://localhost:8090/order`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (responseOrder.status === 201) {
            // Ajouter les produits à la commande
            const orderId = responseOrder.data.id;
            const orderProductsPromises = order.products.map(async (product) => {
                try {
                    const response = await axios.post(
                        `http://localhost:8090/order/${orderId}/products`,
                        product,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    // Status order set validated
                    await axios.put(
                        `http://localhost:8090/order/${orderId}/status`,
                        { status: "validate" },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    return response;
                } catch (error) {
                    console.error(error);
                    throw error; // Arrêter l'exécution si une erreur se produit
                }
            });

            // Attendre que toutes les requêtes pour ajouter les produits soient terminées
            await Promise.all(orderProductsPromises);

            // Effacer le panier après la commande réussie
            clearCart();

            // Naviguer vers la page de paiement
            navigate("/checkout");
        } else {
            console.log("Erreur lors de la création de la commande");
        }
    } catch (error) {
        console.error(error);
    }
};


  const handleChangeAddress = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleChangeNewAddress = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // add style :
  const ConfirmStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #331e38;
  color: white;

  h1 {
    margin-top: 2rem;
  }

  select {
    margin: 1rem 0;
    padding: 0.5rem;
  }

  input {
    margin: 0.5rem 0;
    padding: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  ul {
    list-style: none;
  }

  li {
    margin: 0.5rem 0;
  }


  `;


  return (
    <div >
      <Header />
      <ConfirmStyle>
    <div className="p-2">
      <h1 className="mb-5">Confirmer la commande</h1>
      <div>
        <h2>Addresse de livraison</h2>
        {/* Afficher les adresses disponibles */}
        {/* <select value={selectedAddress} onChange={handleChangeAddress}>
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.street}, {address.city}, {address.country}
            </option>
          ))}
        </select> */}
        {/* Formulaire pour ajouter une nouvelle adresse */}
        <form>
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleChangeNewAddress}
            placeholder="Street"
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleChangeNewAddress}
            placeholder="City"
          />
          <input
            type="text"
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleChangeNewAddress}
            placeholder="Postal Code"
          />
          <input
            type="text"
            name="country"
            value={newAddress.country}
            onChange={handleChangeNewAddress}
            placeholder="Country"
          />
        </form>

        <h2>Paiement</h2>
        <input type="text" placeholder="Credit Card" />
        <input type="text" placeholder="Expiration Date" />
        <input type="text" placeholder="CVV" />
        <input type="text" placeholder="Name" />
        
        
        <h2>Récapitulatif de la commande</h2>
        <ul>
          {cartItems.map((product) => (
            <li key={product.id}>
              {product.name} x {product.quantity} = €
              {product.price * product.quantity}
            </li>
          ))}
        </ul>
        <h2>Total: {getCartTotal()}€</h2>
        <button className="mb-4 btn btn-success" onClick={handleOrder}>Terminer</button>
      </div>
    </div>
    </ConfirmStyle>
      <Footer />
    </div>
  );
};

export default ConfirmOrder;
