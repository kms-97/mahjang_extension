import React, {useState} from 'react'
import * as ShentenUtil from './ShentenUtil'

const Discard = ({dapai, shoupai, shenten, hand, ming}) => {
    const [menzen, setMenzen] = useState(!!ming);
    const [iszumo, setIszumo] = useState(hand.length%3 == 2)
    const [istenpai, setIstenpai] = useState(shenten == 0)
    const [isagari, setIsagari] = useState(shenten == -1)
    const type = dapai[0] == 'm' ? 1 : dapai[0] == 'p' ? 0 : dapai[0] == 's'? 2 : 3;


    return(
            !iszumo && !istenpai ? // 패 13개, 텐파이 아님
                <div className='result'>
                    <div id={dapai[1] == 0 ? 't' + type + '5' : 'f' + type + dapai[1]} className='pai'/>
                    <div></div>
                </div>
            : 123
            
        
    )
}

export default React.memo(Discard)