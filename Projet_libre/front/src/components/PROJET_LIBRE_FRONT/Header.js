import styled from "styled-components";
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { CartContext } from "../../context/cart";
import { useAuth } from "../../hooks/AuthProvider";

// Style
const HeaderStyle = styled.div`
  background-color: #331e38;
  text-align: center;
  color: #333;
  justify-content: space-between;
  align-items: center;
  display: flex;

  .main {
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-shadow: 0px 2px 0px 0px #000;
    padding: 10px 20px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
  }

  .col-title ul {
    display: flex;
  }

  .col-title ul li {
    list-style: none;
    margin: 0 40px;
    cursor: pointer;
  }

  .icon-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-title img {
    width: 40px;
  }

  .icon-title p {
    margin: 0;
    color: #fff;
  }

  .col-logo img {
    width: 110px;
  }

  .col-menu ul {
    display: flex;
  }

  .col-menu ul li {
    list-style: none;
    margin: 0 40px;
    cursor: pointer;
  }

  .icon-title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .col-menu ul li .icon-title img {
    width: 20px;
  }

  .col-menu ul li.cart {
    position: relative;
  }

  .cart-badge {
    position: absolute;
    background-color: #f00;
    color: #fff;
    border-radius: 50%;
    padding: 1px 5px;
    font-size: 12px;
    top: -5px; /* Adjust this value as needed */
    right: -5px; /* Adjust this value as needed */
  }
`;

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated } = useAuth(); // Get the auth status

  return (
    <HeaderStyle>
      <div className="main">
        <div className="col-logo">
          <a href="/">
            <img src="/images/logo.png" alt="logo" />
          </a>
        </div>
        <div className="col-title">
          <ul>
            <li className="icon-title">
              <Link to="/categorie/pc">
                <img src="/images/pc.png" alt="pc" />
                <p>PC</p>
              </Link>
            </li>
            <li className="icon-title">
              <Link to="/categorie/nintendo">
                <img src="/images/nintendo.png" alt="nintendo" />
                <p>Nintendo</p>
              </Link>
            </li>
            <li className="icon-title">
              <Link to="/categorie/ps">
                <img src="/images/play.png" alt="play" />
                <p>PS</p>
              </Link>
            </li>
            <li className="icon-title">
              <Link to="/categorie/xbox">
                <img src="/images/xbox.png" alt="xbox" />
                <p>XBOX</p>
              </Link>
            </li>
            <li className="icon-title">
              <Link to="/search">
                <img src="/images/search.png" alt="search" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-menu">
          <ul>
            {isAuthenticated ? (
              <>
                <li className="icon-title cart">
                  <Link to="/cart">
                    <img src="/images/cart.png" alt="cart" />
                    {cartItems.length > 0 && <div className="cart-badge">{cartItems.length}</div>}
                    <p>Panier</p>
                  </Link>
                </li>
                <li className="icon-title cart">
                  <Link to="/profile">
                    <img src="/images/profile.png" alt="profile" />
                    <p>Profil</p>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="icon-title">
                  <Link to="/login">
                    <img src="/images/profile.png" alt="profile" />
                    <p>Sign in</p>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </HeaderStyle>
  );
};

export default Header;
