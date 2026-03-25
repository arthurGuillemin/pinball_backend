


var socket;
var uri = "ws://localhost:8080";


// uri = "ws://10.92.254.238:8080";

function Button(direction) {
    this.lastState = "up";
    this.direction = direction;
    this.downFunction = function () {
        if (this.lastState == "down") {
            return false;
        }
        // console.log("Down " + this.direction);
        this.lastState = "down";
        socket.sendMessage({
            "type": "message",
            "direction": this.direction,
            "event": "key_down",
            "to": "pinball"
        });
    }
    this.upFunction = function () {
        // console.log("UP " + this.direction);
        this.lastState = "up";
        socket.sendMessage({
            "type": "message",
            "direction": this.direction,
            "event": "key_up",
            "to": "pinball"
        });

    }
}


window.onload = function () {
    socket = new MySocket(uri);
    socket.connect("trigger");

    var leftButton = new Button("left");
    var rightButton = new Button("right");

    let left_btn = document.querySelector("#left");
    let right_btn = document.querySelector("#right");


    left_btn.addEventListener("touchstart", leftButton.downFunction.bind(leftButton));
    left_btn.addEventListener("mousedown", leftButton.downFunction.bind(leftButton));

    left_btn.addEventListener("touchend", leftButton.upFunction.bind(leftButton));
    left_btn.addEventListener("mouseup", leftButton.upFunction.bind(leftButton));

    right_btn.addEventListener("touchstart", rightButton.downFunction.bind(rightButton));
    right_btn.addEventListener("mousedown", rightButton.downFunction.bind(rightButton));

    right_btn.addEventListener("touchend", rightButton.upFunction.bind(rightButton));
    right_btn.addEventListener("mouseup", rightButton.upFunction.bind(rightButton));

    document.addEventListener("keydown", (event) => {

        if (event.key === "ArrowLeft") {
            leftButton.downFunction();
        }

        if (event.key === "ArrowRight") {
            rightButton.downFunction();
        }
    })

    document.addEventListener("keyup", (event) => {

        if (event.key === "ArrowLeft") {
            leftButton.upFunction();
        }

        if (event.key === "ArrowRight") {
            rightButton.upFunction();
        }
    })
}
