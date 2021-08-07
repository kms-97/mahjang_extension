import React from 'react'
import './Round.css'

const Round = ({gameState}) => {
    const fuList = {0:'東', 1:'南', 2:'西', 3:'北'};
    const roundFu = fuList[gameState.fu];
    const roundHonba = gameState.honba;
    const roundkyoku = gameState.kyoku + 1;
    const roundLeftTile = gameState.leftTile;

    return (
        <div className='round-container'>
            <div className='round'>
                {roundFu} {roundkyoku}국 {roundHonba}본장 
            </div>
            <div className='tile'>
                남은 패 : {roundLeftTile}
            </div>
        </div>
    )
}

export default Round;