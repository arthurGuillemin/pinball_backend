var socket;
var uri = "ws://localhost:8080";

class Millis {
    t0 = 0;
    name = "";
    constructor(name) {
        this.name = name;
    }
    start() {
        this.t0 = Date.now();
    }
    end() {
        let diff = (Date.now() - this.t0);
        return diff;
    }
}



class Button {
    state = "UP";
    name = "";
    constructor(name) {
        this.name = name;
    }
    htmlSelector(cssSelector) {
        this.html = document.querySelector(cssSelector);
        this.initEvent();
    }
    initEvent() {
        this.html.addEventListener("touchstart", function (e) {
            e.preventDefault();
            this.downFunction();
            
           

        }.bind(this));

        this.html.addEventListener("touchend", function (e) {
            e.preventDefault();
            this.upFunction();
        }.bind(this));


        this.html.addEventListener("mousedown", function (e) {
            e.preventDefault();
            this.downFunction();
        }.bind(this));
        this.html.addEventListener("mouseup", function (e) {
            e.preventDefault();
            this.upFunction();
        }.bind(this));
    }
    communicationToServer() {
        socket.sendMessage({
            "type": "message",
            "direction": this.name,
            "event": this.state,
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
        if (this.state == "DOWN") {
            return false;
        }
        console.log("Down " + this.name);
        this.state = "DOWN";
        this.communicationToServer();
    }
    upFunction() {
        console.log("UP " + this.name);
        this.state = "UP";
        this.communicationToServer();
    }
}
class Launcher extends Button {
    strengh = 0;
    millis = null;
    constructor(name) {
        super(name);
        this.millis = new Millis(name);
    }
    downFunction() {
        this.strengh = 0;
        super.downFunction();
        this.millis.start();
    }
    upFunction() {
        this.strengh = this.millis.end();
        super.upFunction();
    }
    communicationToServer() {
        socket.sendMessage({
            "type": "message",
            "direction": this.name,
            "event": this.state,
            "to": "pinball",
            "strengh": this.strengh
        });
    }
}

function log(text) {
    let log = document.querySelector("#log");
    log.textContent = text;
}
window.onload = function () {
    let ip = document.querySelector("#ip").value;

    socket = new MySocket(ip);

    socket.connect("trigger");


    socket.addEventListener("ERROR", function () {
        log("ERROR");
    })
    socket.addEventListener("CLOSE", function () {
        log("Disconnected");
    })
    socket.addEventListener("CONNECTED", function () {
        log("Connected");
    })
    socket.addEventListener("CONNECTING", function () {
        log("Try To Connect ...");
    })


    var leftButton = new Button("LEFT");
    var rightButton = new Button("RIGHT");

    var startButton = new Button("START");
    var redButton = new Button("RED");
    var whiteButton = new Button("WHITE");
    var blueButton = new Button("BLUE");

    var luncher = new Launcher("LAUNCHER");

    leftButton.htmlSelector("#left");
    rightButton.htmlSelector("#right");

    startButton.htmlSelector("#start");
    redButton.htmlSelector("#red");
    whiteButton.htmlSelector("#white");
    blueButton.htmlSelector("#blue");

    luncher.htmlSelector("#luncher");
}
