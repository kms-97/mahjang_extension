/* global chrome */
import React, { useState } from 'react';
import PaiContainer from './component/PaiContainer'
import Round from './component/Round'
import PaiList from './component/PaiList'
import Dora from './component/Dora'
import ResultContainer from './component/ResultContainer'
import refreshImg from "./component/img/refresh.png";
import './App.css';

function App() {
  const [pai, setPai] = useState({
        playerHand : [],
        playerMing : []
    });
  const [game, setGame] = useState('');
  const [dora, setDora] = useState([]);
  const [players, setPlayers] = useState('');
  const [playerIndex, setPlayerIndex] = useState('');


  const requestInfo = () => {
    chrome.tabs.query({url : ["https://game.mahjongsoul.com/index.html", "https://mahjongsoul.game.yo-star.com/*"]}, (tab) => {
      chrome.tabs.sendMessage(tab[0].id, {message : 'requestInfo'}, async (response) => {
        try {
          let res = await response;
          if (res) {
            setGame(res.gameState);
            setDora(res.doraState);
            setPlayers(res.playerState);
            setPlayerIndex(getPlayerIndex(res.playerState, true));
            setPai(res.playerPai);
          }
        } catch(err) {
          setGame({lobby: true})
        }
      })
    })
    moveToTop()
  }

  const moveToTop = () => {
    window.scrollTo({top:0, behavior:'smooth'})
  }

  const getPlayerIndex = (obj, boolean) => {
    return Object.keys(obj).find(key => obj[key]['isPlayer'] === boolean);
  }

  return (
    <div>
      {
        (pai.playerHand.length + pai.playerMing.length * 3 < 13 || game.lobby == 1)
        ?<button className="ready-refresh" onClick={requestInfo}>
          <img src={refreshImg}/>
        </button>
        :
        (pai.playerHand.length + pai.playerMing.length * 3 >= 13) &&
        <div className='top-container'>
          <button className="refresh" onClick={requestInfo}>
            <img src={refreshImg}/>
          </button>
          <PaiContainer 
            round={<Round gameState={game}/>}
            dora={<Dora doraState={dora}/>}
            paiList={<PaiList currentPai={pai} playerIndex={playerIndex}/>}
          >
          </PaiContainer>
          <ResultContainer
            currentPai={pai}
            dora={dora}
            playerState={players}
            playerIndex={playerIndex}
            gameState={game}
          >
          </ResultContainer>
        </div>
      }
    </div>
  );
}

export default App;
