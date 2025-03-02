// Dependencies
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { CartContext } from "../../context/cart";
import Footer from "./Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';



// Style
const FicheGameStyle = styled.div`
  background-color: #331e38;
  text-align: center;
  color: #333;
  justify-content: space-between;
  align-items: center;
  margin: 0;

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

  h3 {
    color : white;
  }
  .price {
    font-size : 2rem;
    margin : 0px;
    padding-left: 0.5rem;
    color: white;
  }

  .btn {
    background-color: #F4E8C1;
    margin-left : 0.5rem;
  }
`;



const FicheGame = () => {
    const [game, setGame] = useState({});
    const { id } = useParams();
    const { cartItems, addToCart } = useContext(CartContext)

    useEffect(() => {
        getGame();
    }, []);
    
    const getGame = async () => {
        try {
            const response = await axios.get(`http://localhost:8090/product/${id}`);
            setGame(response.data);
        } catch (error) {
            console.error(error);
        }
    }


  return (
    <FicheGameStyle>
        {/* <Header />
      <div className="card-game">
        <div className="card-img">
          <img src="/images/game.png" alt="game" />
        </div>
        <div className="card-details">
          <h1>{game.name}</h1>
          <p>{game.price} €</p>
        </div>

        <div className="add-cart">
          <button onClick={
            () => {
                addToCart(game)
            }
          }>Ajouter au panier</button>
        </div>
      </div> */}
    <Header />
    <div className="trends-section mb-5">
      <h1>{game.name}</h1>
      <div className="trends d-flex flex-wrap justify-content-between mx-5 mt-5">
        <div className="d-flex justify-content-start">
          <img src="/images/game.png" alt="game" />
        </div>
        <div className="w-25 d-flex flex-column justify-content-start mr-5">
          <div className="d-flex justify-content-start">
            <p className="price text-left">{game.price}€</p>
           {game.quantity > 0 ? <p className="ml-2 75em text-left text-white">{game.quantity} encore en stock</p> : ''}
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn">
              <FontAwesomeIcon icon={faHeart} />
            </button>
            {/* if quantity  > 0 : } */}
            
            {game.quantity > 0 ?        <button onClick={
            () => {
                addToCart(game)
            }} className="btn">
              <FontAwesomeIcon className="mx-3" icon={faCartShopping} />
              Ajouter au panier 
            </button> : <p className="text-white">Rupture de stock</p>}


     
          </div>
        </div>
      </div>
      <div className="trends d-flex flex-wrap justify-content-between mx-5 mt-5">
        <div className="ml-5">
          <h3 className="text-left">A propos</h3>
          <p className="text-justify w-75 h-75 text-white">
            {game.description}
          </p>
        </div>
        <div className=" d-flex flex-column justify-content-start" >
          <img className="w-10" src="/images/items/ghost_1.png" />
          <div className=" d-row">
            <img className="w-10" src="/images/items/ghost_2.png" />
            <img className="w-10" src="/images/items/ghost_3.png" />
          </div>
        </div>
      </div>
    </div>
    <Footer />

    </FicheGameStyle>
  );
};

export default FicheGame;
