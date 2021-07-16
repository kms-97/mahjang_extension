/* global chrome */
chrome.action.onClicked.addListener(function() {
    console.log('open popup')
    chrome.windows.create({url: "index.html", type:"popup"})
})

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log('received')
    if (request.action === "sendPaiInfo") {
        console.log(request.source)
    }
})