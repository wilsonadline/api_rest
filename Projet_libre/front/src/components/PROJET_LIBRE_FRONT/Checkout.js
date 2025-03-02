import { useContext, useEffect } from "react";
import Header from "./Header";
import { CartContext } from "../../context/cart";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Footer from "./Footer";

const CheckoutStyle = styled.div`
    background-color: #331e38;
    color: #fff;
    text-align: center;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    min-height: 80vh;
    padding: 20px;
`;


const Checkout = () => {


    return (
        <>
        <Header />
        <CheckoutStyle>
            <h1>Confirmation...</h1>
            <div>
                <h2>Merci pour votre commande !</h2>
                <Link type="button" className="btn btn-success" to="/">Continuer mes achats</Link>
            </div>
        </CheckoutStyle>   
        <Footer />
        </>
    );
}

export default Checkout;