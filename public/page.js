// This script runs in page context and registers a listener.
// Note that the page may override/hook things like addEventListener...
(() => {
    const el = document.currentScript;
    const {evtToPage, evtFromPage} = JSON.parse(el.dataset.args);
    el.remove();
    addEventListener(evtToPage, () => {
        //(window.GameMgr.Inst.ingame === true) ?
        dispatchEvent(new CustomEvent(evtFromPage, {
            detail : {
                playerPai: JSON.stringify(getPlayerPai()),
                gameState: JSON.stringify(getGameState()),
                allPlayerState: JSON.stringify(getAllPlayerState()),
                doraState: JSON.stringify(getDoraState())
            }
        }))
        //: null;
    });
})();

const getPlayerPai = () => {
    let playerHand = [];
    let playerMing = [];
    for (let i = 0; i < window.view.DesktopMgr.Inst.players[0].hand.length; i++) {
        playerHand.push(window.view.DesktopMgr.Inst.players[0].hand[i].val)
    }
    for (let i = 0; i < window.view.DesktopMgr.Inst.players[0].container_ming.mings.length; i++) {
        playerMing.push(window.view.DesktopMgr.Inst.players[0].container_ming.mings[i])
    }
    let playerPai = {
        playerHand : playerHand,
        playerMing : playerMing
    }
    return playerPai
}


const getGameState = () => {
    const gameState = {
        leftTile : window.view.DesktopMgr.Inst.left_tile_count,
        honba : window.view.DesktopMgr.Inst.index_ben,
        kyoku : window.view.DesktopMgr.Inst.index_ju, // 0~3
        fu : window.view.DesktopMgr.Inst.index_change, // 0~3
        liqibang : Number(uiscript.UI_DesktopInfo.Inst.me.getChildByName("container_lefttop").getChildByName("num_lizhi_0")._skin.replace(/[^0-9]/g,'')) + Number(uiscript.UI_DesktopInfo.Inst.me.getChildByName("container_lefttop").getChildByName("num_lizhi_1")._skin.replace(/[^0-9]/g,''))* 10
    }
    return gameState
}

const getAllPlayerState = () => {
    let playerState = new Object;
    let playerIndex = window.view.DesktopMgr.Inst.seat;
    class keys {
        constructor() {
            this.nickName = null,
            this.score = null,
            this.isLiqi = null,
            this.isPlayer = null
        }
    }
    for (let i = 0; i < window.view.DesktopMgr.Inst.players.length; i++) {
        playerState[i] = new keys();
    }
    for (let i = 0; i < 4; i++) {
        playerState[i]['nickName'] = window.view.DesktopMgr.Inst.player_datas[i].nickname;
        playerState[i]['score'] = window.view.DesktopMgr.Inst.players[(i + (4 - playerIndex))%4].score;
        playerState[i]['isLiqi'] = window.view.DesktopMgr.Inst.players[(i + (4 - playerIndex))%4].liqibang._activeInHierarchy || window.view.DesktopMgr.Inst.players[i].container_qipai.last_is_liqi;
        playerState[i]['isPlayer'] = i == playerIndex? true : false
    }
    return playerState
}

const getDoraState = () => { 
    return window.view.DesktopMgr.Inst.dora
}