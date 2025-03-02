// GameCard.js
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Style
const GameCardStyle = styled.div`
  margin-top: 2rem;

  img{
    width : 100%;
  }

  .link {
    color : white;
    text-decoration : none;
  }
`;


// const GameCard = ({ game }) => {
//   return (
//     <GameCardStyle>
//       <Link to={`/game/${game.id}`}>
//       <div className="card-game">
//         <div className="card-img">
//           <img src="/images/game.png" alt="game" />
//         </div>
//         <div className="card-details">
//           <h1>{game.name}</h1>
//           <p>{game.price} €</p>
//         </div>
//       </div>
//       </Link>
//     </GameCardStyle>
//   );
// };
const GameCard = ({ game }) => {
  return (
    <GameCardStyle>
      <Link className="link" to={`/game/${game.id}`}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img src="/images/game.png" alt="game" />
        <div className="d-flex justify-content-between w-100">
          <p>{game.name}</p>
          <p>{game.price}</p>
        </div>
      </div>
      </Link>
    </GameCardStyle>
  );
};


export default GameCard;
