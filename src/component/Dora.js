import React from 'react'
import './Pai.css'
import './Dora.css'

const Dora = ({doraState}) => {
    const identified = doraState.map(
        ({dora, index, type}) => (
            <Identified dora={dora} index={index} type={type}/>
        )
    );
    
    const blankArray = Array(5 - doraState.length).fill('0');
    const unIdentified = blankArray.map(() => (
        <UnIdentified/>
    ))

    return (
        <div className="dora-container">
            <div className='dora-identified'>
                {identified}
            </div>
            <div className='dora-unidentified'>
                {unIdentified}
            </div>
        </div>
    )
}

const Identified = ({dora, index, type}) => {
    const paiImg = (dora===true)?'t'+ type + index:'f' + type + index;
    return (
        <div id={paiImg} className='pai'/>
    )
}

const UnIdentified = () => {
    return (
        <div id='b' className='pai'/>
    )
}

export default React.memo(Dora)

