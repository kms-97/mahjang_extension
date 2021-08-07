import React from 'react'
import './PaiContainer.css'


const PaiContainer = ({round, dora, paiList}) => {
    const imgRotate = (e) => {
    }

    return (
        <div className="state-container">
            <div className="state-game">
                { round }
                { dora }
            </div>
            <div>
                { paiList }
            </div>
        </div>
    )
}

export default React.memo(PaiContainer);

