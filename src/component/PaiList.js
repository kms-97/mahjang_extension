import React from 'react'
import HandPai from './HandPai';
import MingPai from './MingPai';
import './PaiList.css';


const PaiList = ({currentPai, playerIndex}) => {

    const handPai = currentPai['playerHand'].map(
        ({dora, index, type}, idx, array) => {
            return(
            (idx == array.length - 1 && array.length%4 == 2)?
            <HandPai dora={dora} index={index} type={type} last='true'/>
            : <HandPai dora={dora} index={index} type={type} last='false'/>
            )
        }
    );
    let mingPai = null;
    if (!(currentPai['playerMing'].length == 0)) {
        mingPai = currentPai['playerMing'].map(
            ({from, pais, type}) =>(
                <MingPai from={from} pais={pais} type={type} playerIndex={playerIndex}/>
            )
        )
    }

    return(
        <div className="state-pai">
            <div className="hand-container">
                {handPai}
            </div>
            <div className="ming-container">
                {mingPai}
            </div>
        </div>
    )
}

export default React.memo(PaiList);