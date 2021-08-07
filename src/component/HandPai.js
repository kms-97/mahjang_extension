import React from 'react'
import './Pai.css'

const HandPai = ({dora, index, type, last}) => {
    const paiImg = (dora===true)?'t'+ type + index:'f' + type + index;

    return (
        last == 'true' ?
        <div className='pai tsumo' id={paiImg}/>
        :<div className='pai' id={paiImg}/>
    )
}

export default React.memo(HandPai);