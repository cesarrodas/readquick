const contextMenuItem = {
  "id": "readQuick",
  "title": "readQuick",
  "contexts": ["selection"]
};

let optionData = undefined;
let selectedSpeed = undefined;

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickedData){
  if (clickedData.menuItemId == "readQuick" && clickedData.selectionText){
    const text = clickedData.selectionText;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {quickRead: text}, function(response) {
        console.log(response.ok);
      });
    });
    
  }
});