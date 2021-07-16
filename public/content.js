/* global chrome */


window.onload = function() {
    document.getElementById('layaCanvas').addEventListener("click", main)
}

function isInGame() {
	return window != null && window.view != null && window.view.DesktopMgr != null && window.view.DesktopMgr.player_link_state != null;
}

function main() {
    console.log('func main works');
    if (isInGame()) {
        console.log('isInGame works');   
        chrome.runtime.sendMessage({
            action: "sendPaiInfo",
            source: setHandPai()
        })
    }
}

function setHandPai() {
    let handPai = window.view.DesktopMgr.Inst.players[0].hand;
    return handPai
}