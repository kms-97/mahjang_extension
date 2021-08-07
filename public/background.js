/* global chrome */

chrome.action.onClicked.addListener(function() {
    chrome.tabs.query({active : true, currentWindow: true}, (tabs) => {
        if (tabs[0].url == 'https://game.mahjongsoul.com/index.html') {
            chrome.windows.create({url: "index.html", type:"popup", width:900, height:580})
        }
    })
})