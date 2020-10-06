
class ReadingBar {

  constructor(id, x, moveDividers, db){
    this.database = db;
    this.element = document.createElement("div");
    this.x = x + "px";
    this.selected = false;
    this.element.setAttribute("class", "normalBar");
    this.id = id;
    this.visible = false;
    let doc = document.getElementsByTagName("body")[0];
    doc.append(this.element);
    this.clickHandler = this.clickHandler.bind(this);
    this.mouseHandler = this.mouseHandler.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.moveToPosition = this.moveToPosition.bind(this);
    this.setShield();
    this.visibility(false);
    this.moveDividers = moveDividers;
  }

  setShield(){
    let doc = document.getElementsByTagName("body")[0];
    if(this.id == "left"){
      this.shield = document.createElement("div");
      this.shield.setAttribute("class", "leftShield");
      doc.append(this.shield);
      this.shield.style.left = parseInt(this.x) - (window.innerWidth) + "px";
    } else {
      this.shield = document.createElement("div");
      this.shield.setAttribute("class", "rightShield");
      doc.append(this.shield);
      this.shield.style.left = (parseInt(this.x) + 10) + "px";
    }
  }

  moveShield(){
    if(this.id == "left"){
      this.shield.style.left = parseInt(this.x) - (window.innerWidth) + "px";
    } else {
      this.shield.style.left = (parseInt(this.x) + 10) + "px";
    }
  }

  moveLeft(moveSize){
    if(!moveSize){
      this.x = (parseInt(this.x, 10) - 5) + "px";
    } else {
      this.x = (parseInt(this.x, 10) - moveSize) + "px";
    }
    this.moveToPosition(this.x);
  }

  moveRight(moveSize){
    if(!moveSize){
      this.x = (parseInt(this.x, 10) + 5) + "px";
    } else {
      this.x = (parseInt(this.x, 10) + moveSize) + "px";
    }
    this.moveToPosition(this.x);
  }

  moveToPosition(position){
    let pos = parseInt(position);
    this.x = pos + "px";
    
    if(this.id == "left"){
      if(parseInt(this.x) < 100){
        this.x = 100 + "px";
      } else if (parseInt(this.x) > (window.innerWidth - 200)){
        this.x = (window.innerWidth - 200) + "px";
      }
    } else {
      if(parseInt(this.x) > (window.innerWidth - 100)){
        this.x = (window.innerWidth - 100) + "px";
      } else if (parseInt(this.x) < 200){
        this.x = "200px";
      }
    }
    this.element.style.left = this.x;
    this.moveShield();
    this.moveDividers();
  }

  visibility(bool){
    if(bool){
      this.visible = true;
      this.element.style.display = "block";
      this.shield.style.display = "block";
    } else {
      this.visible = false;
      this.element.style.display = "none";
      this.shield.style.display = "none";
    }
  }

  mouseHandler(e){
    if(e.movementX > 0){
      this.moveRight(10);
    } else {
      this.moveLeft(10);
    }
  }

  toggleSelect(){
    this.selected = !this.selected;
    if(this.selected){
      this.element.setAttribute("class", "normalBar selectedBar");
      document.addEventListener("mousemove", this.mouseHandler);
    } else {
      this.element.setAttribute("class", "normalBar");
      document.removeEventListener("mousemove", this.mouseHandler);
      this.database.saveData(`${this.id}Bar`, this.x);
    }
  }

  clickHandler(e) {
    this.selected = !this.selected;
    if(this.selected){
      this.element.setAttribute("class", "normalBar selectedBar");
      document.addEventListener("mousemove", this.mouseHandler);
    } else {
      this.element.setAttribute("class", "normalBar");
      this.database.saveData(`${this.id}Bar`, this.x);
      document.removeEventListener("mousemove", this.mouseHandler);
    }
  }

  addListeners(){
    this.element.addEventListener("click", this.clickHandler);
    this.shield.addEventListener("click", this.clickHandler);
  }

  removeListeners(){
    this.element.removeEventListener("click", this.clickHandler);
    this.shield.addEventListener("click", this.clickHandler);
  }

}

class BarManager {

  constructor(DB) {
    this.database = DB;
    this.active = false;
    this.createDividers();
    this.moveDividers = this.moveDividers.bind(this);
    this.leftBar = new ReadingBar('left', 200, this.moveDividers, this.database);
    this.rightBar = new ReadingBar('right', 800, this.moveDividers, this.database);
    this.readingBars = [];
    this.readingBars.push(this.leftBar);
    this.readingBars.push(this.rightBar);
    this.addListeners = this.addListeners.bind(this);
    this.loadActivation();
  }

  loadActivation() {
    this.database.loadData('leftBar', (result) => {
      if(parseInt(result.leftBar)){
        this.leftBar.moveToPosition(result.leftBar);
      } else {
        this.leftBar.moveToPosition("200px");
      }
    });

    this.database.loadData('rightBar', (result) => {
      if(parseInt(result.rightBar)){
        this.rightBar.moveToPosition(result.rightBar);
      } else {
        this.rightBar.moveToPosition((window.innerWidth - 200) + "px");
      }
    });

    this.database.loadData('activated', (result) => {
      this.active = Boolean(result.activated);
      if (this.active){
        this.activate();
      } else {
        this.deactivate();
      }
    });
  }

  createDividers(){
    let doc = document.getElementsByTagName("body")[0];
    this.dividerOne = document.createElement("div");
    this.dividerOne.setAttribute("class", "divider");
    this.dividerTwo = document.createElement("div");
    this.dividerTwo.setAttribute("class", "divider");
    this.dividerOne.style.display = "none";
    this.dividerTwo.style.display = "none";
    doc.append(this.dividerOne);
    doc.append(this.dividerTwo);
  }

  moveDividers(){
    let piece = Math.floor((parseInt(this.rightBar.x) - parseInt(this.leftBar.x))/3);
    this.dividerOne.style.left = parseInt(this.leftBar.x) + piece + "px";
    this.dividerTwo.style.left = parseInt(this.rightBar.x) - piece + "px";
  }
  
  addListeners(){
    document.onkeydown = function(e) {
      switch (e.key) {
        case 'ArrowLeft':
          for(let i = 0; i < this.readingBars.length; i++){
            if(this.readingBars[i].selected){
              this.readingBars[i].moveLeft();
            }
          }
          break;
        case 'ArrowRight':
          for(let i = 0; i < this.readingBars.length; i++){
            if(this.readingBars[i].selected){
              this.readingBars[i].moveRight();
            }
          }
          break;
      }
    }.bind(this);
    for(let i = 0; i < this.readingBars.length; i++){
      this.readingBars[i].addListeners();
    }
  }

  removeListeners(){
    document.onkeydown = null;
    for(let i = 0; i < this.readingBars.length; i++){
      this.readingBars[i].removeListeners();
    }
  }

  activate () {
    this.active = true;
    for(let i = 0; i < this.readingBars.length; i++){
      this.readingBars[i].visibility(true);
    }
    this.dividerOne.style.display = "block";
    this.dividerTwo.style.display = "block";
    this.addListeners();
    this.database.saveData('activated', true);
  }

  deactivate() {
    this.active = false;
    for(let i = 0; i < this.readingBars.length; i++){
      this.readingBars[i].visibility(false);
    }
    this.dividerOne.style.display = "none";
    this.dividerTwo.style.display = "none";
    this.removeListeners();
    this.database.saveData('activated', false);
  }

}

class DataManager {
  saveData(key, value){
    let data = {};
    data[key] = value;
    chrome.storage.sync.set( data , function() {
      console.info('save completed');
    });
  }

  loadData(key, cb){
    return chrome.storage.sync.get([key], cb);
  }
}

class QuickReader {
  constructor () {
    this.active = false;
    this.fullText = '';
    this.chunkedText = [];
    this.container = document.createElement("div");
    this.container.setAttribute("class", "quickReader");
    this.text = document.createElement("div");
    this.text.setAttribute("class", "centeredContent");
    this.index = 0;
    this.closeCounter = 0;
    this.keyHandler = this.keyHandler.bind(this);
    this.container.append(this.text);
    this.hiddenInput = document.createElement("input");
    this.hiddenInput.setAttribute("class", "hiddenInput");
    this.container.append(this.hiddenInput);
    this.container.style.display = "none";
    let dom = document.getElementsByTagName("body")[0];
    dom.append(this.container);
  }

  makeReader(){
    let dom = document.getElementsByTagName("body")[0];
    this.index = 0;
    this.text.innerHTML = this.chunkedText[this.index];
    this.container.style.display = "flex";
    dom.classList.add('hideScrollBarsOne');
    dom.classList.add('hideScrollBarsTwo');
    this.addListeners();
    this.hiddenInput.focus();
  }

  drawText(){
    this.text.innerHTML = this.chunkedText[this.index];
  }

  keyHandler(e){
    //e.preventDefault();
    //e.stopPropagation();
    if(e.keyCode == 37){
      // left 
      if(this.index > 0){
        this.index = this.index - 1;
      }
      this.drawText();
    } else if (e.keyCode == 39) {
      // right
      if(this.index < this.chunkedText.length - 1){
        this.index = this.index + 1;
      }
      this.drawText();
      if(this.index == this.chunkedText.length - 1){
        this.closeCounter++;
      }
      if(this.closeCounter == 3){
        this.closeCounter = 0;
        this.removeReader();
      }

    } else if (e.keyCode == 27){
      this.removeReader();
    }
  }

  addListeners(){
    //this.hiddenInput.focus();
    this.hiddenInput.addEventListener("keydown", this.keyHandler);
  }

  removeListeners(){
    //this.container.focus();
    this.hiddenInput.removeEventListener("keydown", this.keyHandler);
  }

  removeReader(){
    let dom = document.getElementsByTagName("body")[0];
    dom.classList.remove('hideScrollBarsOne');
    dom.classList.remove('hideScrollBarsTwo');
    this.container.style.display = "none";
    this.removeListeners();
  }

  setText(text){
    if(typeof text == "string"){
      this.fullText = text;
    }
  }

  chunkText(){
    let splitText = this.fullText.split(" ");
    let chunked = [];
    let lastChunk = [];
    for(let chunk of splitText){
      if(lastChunk.length >= 5){
        lastChunk = lastChunk.join(" ");
        chunked.push(lastChunk);
        lastChunk = [chunk];
      } else {
        lastChunk.push(chunk);
      }
    }
    if(lastChunk.length > 0){
      chunked.push(lastChunk.join(" "));
    }
    this.chunkedText = chunked;
  }
}

class Main {
  constructor(){
    this.DB = new DataManager();
    this.barMan = new BarManager(this.DB);
    this.quickReader = new QuickReader();
  }

  getMessage(message){
    if(message.readingBars == true){
      this.barMan.activate();
    } else if(this.barMan.active == true && message.readingBars == false){
      //console.log("closing is ran");
      this.barMan.deactivate();
    }
    if(message.quickRead){
      this.quickReader.setText(message.quickRead);
      this.quickReader.chunkText();
      this.quickReader.makeReader();
    }
  }
}

const App = new Main();

chrome.runtime.onMessage.addListener(
  // request, sender, sendResponse
  function(request, sender, sendResponse) {
    App.getMessage(request);
    sendResponse({ok: true}); 
  }
);

document.addEventListener("click", function(e){
  if(e && e.target.className != "rightShield" && e.target.className != "leftShield"){
    if(this.leftBar.selected) { 
      this.leftBar.toggleSelect();
    }
    if(this.rightBar.selected){
      this.rightBar.toggleSelect();
    }
  } 
}.bind(App.barMan));
