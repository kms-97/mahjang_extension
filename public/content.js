/* global chrome */

const evtToPage = chrome.runtime.id;
const evtFromPage = chrome.runtime.id + '-response';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'requestInfo') {
        addEventListener(evtFromPage, (e) => {
            sendResponse({
                playerPai : JSON.parse(e.detail.playerPai),
                gameState : JSON.parse(e.detail.gameState),
                playerState : JSON.parse(e.detail.allPlayerState),
                doraState : JSON.parse(e.detail.doraState)
            })
        }, {once: true});
        dispatchEvent(new Event(evtToPage));
        return true
    }
});

const script = document.createElement('script');
script.src = chrome.runtime.getURL('page.js');
script.dataset.args = JSON.stringify({evtToPage, evtFromPage});
document.documentElement.appendChild(script);