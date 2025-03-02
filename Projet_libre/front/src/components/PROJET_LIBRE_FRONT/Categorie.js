import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import styled from 'styled-components';
import GameCard from './GameCard';
import { Link } from 'react-router-dom';
import axios from 'axios';


// Style
const CategorieStyle = styled.div`
  background-color: #331e38;
  text-align: center;
  color: #333;
  justify-content: space-between;
  align-items: center;
  margin: 0;

  .header-section {
    position: relative;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 1);
  }

  .header-section .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(50%);
    z-index: 1;
  }

  .header-section h1 {
    font-size: 48px;
    margin: 0;
    padding-top: 20px;
    z-index: 2;
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

  select{
    margin-right: 50px;
  }

  .pagination {
    display: inline-block;
    margin-top: 1rem;
  }
  
  .pagination a {
    color: white;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    margin-left : 1rem;
  }
  
  .pagination a.active {
    background-color: #331e38;
    color: white;
    border-radius : 50%;
    border : 1px solid white;
  }
  
  .pagination a:hover:not(.active) {background-color: #ddd; border-radius : 50%; color : #331e38;}
`;

const Categorie = () => {
    const { categorie } = useParams();
    const [games, setGames] = React.useState([]);

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


    const getBgImage = () => {
        switch (categorie) {
            case "pc":
                return "/images/pc.jpg";
            case "nintendo":
                return "/images/nintendo.jpg";
            case "xbox":
                return "/images/xbox.jpg";
            case "ps":
                return "/images/ps.jpg";
            default:
                return "/images/bg.png";
        }
    }

    return (
        <CategorieStyle>
        <Header />
        <div className="header-section">
            <div className="background-image" style={{ backgroundImage: `url(${getBgImage()})` }}></div>
            <h1>{categorie}</h1>
        </div>
        <div className="d-flex justify-content-between">
          {/* <h1>PC</h1> */}
          <select name="pets" id="pet-select">
            <option value="">Trier par</option>
            <option value="option_1">Option_1</option>
            <option value="option_2">Option_2</option>
            <option value="option_3">Option_3</option>
            <option value="option_4">Option_4</option>
            <option value="option_5">Option_5</option>
            <option value="option_6">Option_6</option>
          </select>
        </div>
        <div className="trends d-flex flex-wrap justify-content-around">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
        <div class="pagination mb-4">
          <a href="#" class="active">1</a>
          <a href="#">2</a>
          <a href="#">3</a>
          <a href="#">4</a>
          <a href="#">5</a>
          <a href="#">6</a>
        </div>


        <Footer />
        </CategorieStyle>
    );
}

export default Categorie;