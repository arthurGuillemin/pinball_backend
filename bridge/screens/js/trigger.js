


var socket;
var uri = "ws://localhost:8080";

class millis {

    constructor() {

    }
    begin() {

    }


}

class Button {
    lastState = "up";
    name = "";

    constructor(name) {
        this.name = name;
    }
    htmlSelector(cssSelector) {
        this.html = document.querySelector(cssSelector);
        this.initEvent();
    }
    initEvent() {
        this.html.addEventListener("touchstart", this.downFunction.bind(this));
        this.html.addEventListener("touchend", this.upFunction.bind(this));
        this.html.addEventListener("mousedown", this.downFunction.bind(this));
        this.html.addEventListener("mouseup", this.upFunction.bind(this));
    }
    communicationToServer() {
        socket.sendMessage({
            "type": "message",
            "direction": this.name,
            "event": this.lastState,
            "to": "pinball"
        });

        // socket.sendMessage({
        //     "type": "message",
        //     "message": "Gooooooooood",
        //     "direction": this.name,
        //     "to": "backGlass"
        // });
    }
    downFunction() {
        if (this.lastState == "down") {
            return false;
        }
        console.log("Down " + this.name);
        this.lastState = "down";
        this.communicationToServer();
    }
    upFunction() {
        console.log("UP " + this.name);
        this.lastState = "up";
        this.communicationToServer();
    }
}
class Launcher extends Button {
    strengh = 0;
    constructor(name) {
        super(name);
    }
    downFunction() {
        if (this.lastState == "down") {
            return false;
        }
        console.log("Down " + this.name);
        this.lastState = "down";

    }
    upFunction() {
        console.log("UP " + this.name);
        this.lastState = "up";

    }
}


window.onload = function () {
    socket = new MySocket();
    socket.connect("trigger");

    var leftButton = new Button("left");
    var rightButton = new Button("right");
    var luncher = new Launcher("luncher");

    leftButton.htmlSelector("#left");
    rightButton.htmlSelector("#right");
    luncher.htmlSelector("#luncher");









}
