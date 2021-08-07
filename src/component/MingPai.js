import React from 'react'
import './Pai.css'

const MingPai = ({from, pais, type, playerIndex}) => {
    const fromWho = playerIndex - from[from.length - 1];
    if (type === 0) { 
        return (
            <div className="ming">
                {pais.map(({dora, index, type}, idx) => (
                    (idx === 2) ? <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai received chi'/> :
                    <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai chi'/>
                ))}
            </div>
        )
    } else if (type === 1) {
        const receiveIndex = (Math.abs(fromWho) === 2) ? 1 : (fromWho === -3 || fromWho === 1) ? 0 : 2;
        return (
            <div className="ming">
                {pais.map(({dora, index, type}, idx) => (
                    (idx === receiveIndex)  ? <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai received pon'/> :
                    <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai pon'/>
                ))}
            </div> 
        )
    } else if (type === 2) {
        const receiveIndex = (Math.abs(fromWho) === 2) ? 1 : (fromWho === -3 || fromWho === 1) ? 0 : 3;
        return (
            <div className="ming">
                {pais.map(({dora, index, type}, idx) => (
                    (idx === receiveIndex) ? <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai received kang'/> :
                    <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai kang'/>
                ))}
            </div> 
        )
    } else {
        return (
            <div className="ming">
                {pais.map(({dora, index, type}, idx) => (
                    (idx === 0 || idx === 3) ? <div id='b' className='pai kang'/> :
                    <div id={dora===true?'t'+ type + index:'f' + type + index} className='pai kang'/>
                ))}
            </div>
        )
    }
}

export default React.memo(MingPai);
