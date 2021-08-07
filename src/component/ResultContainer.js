import React from 'react'
import * as ShentenUtil from './ShentenUtil'
import './ResultContainer.css'

const ResultContainer = ({currentPai, dora, playerState, playerIndex, gameState}) => {
    let {playerHand:hand, playerMing:ming} = currentPai;
    let shoupai = ShentenUtil.convertPaiObjtoList(hand, ming);
    let shenten = ShentenUtil.xiangting(shoupai);

    let param = {
        zhuangfeng: gameState.kyouku, // 場風 (0: 東, 1: 南, 2: 西, 3: 北)
        menfeng: ShentenUtil.getOwnFu(playerIndex, gameState.kyouku), // 和了者の自風
        hupai: {
            lizhi: Number(playerState[playerIndex]['isLiqi']), // 1: 立直, *2: ダブル立直*
        },
        baopai: dora,
        jicun: {
            changbang: gameState.honba,            // 積み棒の数
            lizhibang: gameState.liqibang      // 리치봉(유국 + 현재판)
        }
    };

    if (hand.length % 3 == 1) { // 패가 13장
        if (shenten > 0) {// 노텐파이
            const youkouPai = ShentenUtil.findYoukouPai(shoupai, shenten);
            
            return(
                <div className='result-container'>
                    <div className="shenten">
                        {shenten}
                    </div>
                    <div className='result-sub-container'>
                        <div className='select-pai'/>
                        <div className='pai-list'>
                            {youkouPai.map(([type, idx])=> {
                                let typeIdx = (type == 'm') ? 1 : type == 'p' ? 0 : type == 's' ? 2 : 3;
                                return (
                                <div id={'f'+ typeIdx + idx} className='pai'/>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        } else if (shenten == 0) { // 텐파이
            const youkouPai = ShentenUtil.findYoukouPai(shoupai, shenten);
            const result = youkouPai.map(([type, idx]) => {
                let addShoupai = ShentenUtil.addPai(shoupai, type, idx)
                let max = ShentenUtil.hule(addShoupai, type+idx, param)
                let typeIdx = (type == 'm') ? 1 : type == 'p' ? 0 : type == 's' ? 2 : 3;
                ShentenUtil.reducePai(shoupai, type, idx)
                return(
                <div className='result-sub-container'>
                    <div className='select-pai pai' id={'f'+ typeIdx + idx}/>
                    <div className='result'>
                        {max.zumo.hupai.length > 0 ?
                        <div className='zumo'>
                            <div className='hupai'>
                                {max.zumo.hupai.map(({name, fanshu}) =>
                                    (fanshu > 0 ?
                                        name + ' ' + fanshu + ' '
                                        : fanshu == '*' ?
                                            name + ' ' + '역만' + ' '
                                            : fanshu == '**' ?
                                            name + ' ' + '더블역만' + ' '
                                            : null))
                                }
                            </div>
                            <div className='fanshu'>
                                {max.zumo.fanshu} + '판 '    
                                + {max.zumo.fu} + '부'
                            </div>
                            <div className='last-score'>
                                {max.zumo.score[0]}
                            </div>
                            <div className='score'>
                                ({max.zumo.score[1]})
                            </div>
                        </div>
                        : <div className='result'><div className='zumo'>역 없음</div></div>
                        }
                        {max.ron.hupai.length > 0 ?
                        <div className='ron'>
                            <div className='hupai'>
                                {max.ron.hupai.map(({name, fanshu}) =>
                                    (fanshu > 0 ?
                                        name + ' ' + fanshu + ' '
                                        : fanshu == '*' ?
                                            name + ' ' + '역만' + ' '
                                            : fanshu == '**' ?
                                            name + ' ' + '더블역만' + ' '
                                            : null))
                                }
                            </div>
                            <div className='fanshu'>
                                {max.ron.fanshu} + '판 '    
                                + {max.ron.fu} + '부'
                            </div>
                            <div className='last-score'>
                                {max.ron.score[0]}
                            </div>
                            <div className='score'>
                                ({max.ron.score[1]})
                            </div>
                        </div>
                        : <div className='ron-result'>역 없음</div>
                        }
                    </div>
                </div>
                )
            })
            return(
                <div className='result-container'>
                    <div className="shenten">
                        {shenten}
                    </div>
                    {result}
                </div>
            )
        }
    } else { // 패가 14장 텐파이 여부 상관없이 버림패 구한 뒤 요구패 출력
        let discardPai = ShentenUtil.findDiscardPai(shoupai, shenten)
        let youkouPai22 = discardPai.map(([type, idx]) => {
            let discardShoupai = ShentenUtil.reducePai(shoupai, type, idx);
            let youkouPai = ShentenUtil.findYoukouPai(discardShoupai, shenten);
            ShentenUtil.addPai(shoupai, type, idx)
            return([[type, idx]].concat([youkouPai]))
        })
        youkouPai22.sort((b,a)=>(a[1].length-b[1].length))

        const result = youkouPai22.map(([discard, youkou]) => {
            let doraIdx = (discard[1] == 0) ? 't' : 'f';
            let typeIdx = (discard[0] == 'm') ? 1 : discard[0] == 'p' ? 0 : discard[0] == 's' ? 2 : 3;
            if (discard[1] == 0) discard[1] = 5

            return(
                <div className='result-sub-container'>
                    <div className='select-pai pai' id={doraIdx+ typeIdx + discard[1]}/>
                    <div className='pai-list'>
                        {youkou.map(([type, idx])=> (
                            (type == 'm') ?
                            <div id={'f'+'1'+idx} className='pai'/>
                            : type == 'p' ?
                            <div id={'f'+'0'+idx} className='pai'/>
                            : type == 's' ?
                            <div id={'f'+'2'+idx} className='pai'/> 
                            : <div id={'f'+'3'+idx} className='pai'/>
                            ))
                        }
                </div>
            </div>
            )
        })

        return (
            <div className='result-container'>
                <div className="shenten">
                    {shenten}
                </div>
                {result}
            </div>
        )
    }
}

export default ResultContainer

const getLiqibang = (obj, boolean) => {
    return Object.keys(obj).filter(key => obj[key]['isLiqi'] === boolean).length;
}
