// Home.js
import Header from "./Header";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GameCard from "./GameCard";
import axios from "axios";
import Footer from "./Footer";

// Style
// const HeaderStyle = styled.div`
//   background-color: #331e38;
//   text-align: center;
//   color: #333;
//   justify-content: space-between;
//   align-items: center;
//   margin: 0;

//   .header-section {
//     height: 80vh;
//     color: #fff;
//     background-size: cover;
//     background-position: center;
//     background-repeat: no-repeat;
//     background-image: url("images/bg.png");
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   }

//   .header-section:after {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     top: 0;
//     left: 0;
//     background: rgba(0, 0, 0, 1);
//     opacity: 0;
//     transition: all 1s;
//     -webkit-transition: all 1s;
//   }

//   .header-section:hover:after {
//     opacity: 1;
//   }

//   .trends-section {
//     padding: 50px 0;
//   }

//   .trends {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//     gap: 20px;
//     padding: 0 50px;
//   }

//   .trends-section h1 {
//     margin: 0;
//     font-size: 24px;
//     text-align: start;
//     padding-left: 50px;
//     padding-bottom: 50px;
//     color: #fff;
//   }
// `;

const HomeStyle = styled.div`
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

  .header-section:after {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 1);
    opacity: 0;
    transition: all 1s;
    -webkit-transition: all 1s;
  }
  .header-section:hover:after {
    opacity: 1;
  }

    .trends-section { 
    padding: 50px 0;
    }

    .trends-section h1 {
    margin: 0;
    font-size: 24px;
    text-align: start;
    padding-left: 50px;
    padding-bottom: 50px;
    color: #fff;
    }
`;


const Home = () => {
  const [games, setGames] = useState([]);

  // get all games with axios
  useEffect(() => {
    axios
      .get("http://localhost:8090/product")
      .then((res) => {
        console.log(res);
        setGames(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <HomeStyle>
        <div>
        <Header />
        <div className="header-section"></div>

        <div className="trends-section">
          <h1>Tendances</h1>
          <div className="trends d-flex flex-wrap justify-content-around">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
        <Footer />
      </div>

    </HomeStyle>
  );
};

export default Home;
