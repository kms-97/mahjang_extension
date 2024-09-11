import { RequestGameInfoEvent } from "@src/scripts/customEvents";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === RequestGameInfoEvent.type) {
    addEventListener(
      "ResponseGameInfo",
      (e) => {
        sendResponse(e.detail);
      },
      { once: true }
    );
    dispatchEvent(new RequestGameInfoEvent());
    return true;
  }
});

const script = document.createElement("script");
script.src = chrome.runtime.getURL("page.js");
document.documentElement.appendChild(script);
