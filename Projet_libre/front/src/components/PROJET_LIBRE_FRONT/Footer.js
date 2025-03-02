import React from "react";
import styled from "styled-components";

// Style
const FooterStyle = styled.div`
  .col-logo img {
    width: 110px;
  }

  a {
    color: white;
    text-decoration: none;
    text-align: left;
  }

  .reseaux div {
    width: 5rem;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .main {
    width: 100%;
    background-color: #331e38;
    margin: 0;
    box-shadow: 0px 0px 10px 0px #00000078;
    padding: 1rem;
  }
`;

const Footer = () => {
  return (
    <FooterStyle>
      <div className="main d-flex justify-content-between">
        <div className="d-flex">
          <div className="d-flex justify-content-between flex-column mx-5">
            <a href="/" className="mt-0">Les conditions de vente</a>
            <a href="/">Politique de confidentialité</a>
            <a href="/">Programme d'affiliation</a>
          </div>
          <div className="d-flex justify-content-between flex-column">
            <a href="/" className="mt-0">Nous contacter</a>
            <a href="/">Utiliser une Carte Cadeau</a>
            <a href="/">Retrouve les dernières actus jeu vidéo</a>
          </div>
        </div>

        <div className="col-logo d-flex flex-column justify-content-center align-items-center">
          <img src="/images/logo.png" alt="logo" />
          <a href="/" className="mt-2 mb-0">Copyright © 2024 Instant Game - All rights reserved</a>
        </div>

        <div className="reseaux d-flex justify-content-end align-items-center mr-5">
          <div>
            <a href="/"><img src="/images/discord.png" alt="logo" /></a>
          </div>
          <div>
            <a href="/"><img src="/images/instagram.png" alt="logo" /></a>
          </div>
          <div>
            <a href="/"><img src="/images/facebook.png" alt="logo" /></a>
          </div>
          <div>
            <a href="/"><img src="/images/youtube.png" alt="logo" /></a>
          </div>
        </div>
      </div>
    </FooterStyle>
  );
};

export default Footer;
