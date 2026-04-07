

function hitRight() {
    document.querySelector("#right").style.transform = "rotate(65deg)";
}
function unhitRight() {
    document.querySelector("#right").style.transform = "rotate(0deg)";
}

function hitLeft() {
    document.querySelector("#left").style.transform = "rotate(-65deg)";
}
function unhitLeft() {
    document.querySelector("#left").style.transform = "rotate(0deg)";
}


function animateLauncher(val) {
    let launcher = document.querySelector("#launcher");
    const animation = launcher.animate([{ transform: "translateY(0)" }, { transform: "translateY(" + val + "px)" }], {
        duration: 400,
        easing: "ease-out",
        fill: "forwards"
    });
    animation.finished.then(() => {
        launcher.animate(
            [
                { transform: "translateY(" + val + "px)" },
                { transform: "translateY(0)" }
            ],
            {
                duration: 100,
                fill: "forwards",
                easing: "Ease-In",
            }
        );
    });

}

function setMessageText(text) {
    document.querySelector("#message").textContent = text;

}
function log(text) {
    let log = document.querySelector("#log");
    log.textContent = text;
}

var socket;
var uri = "ws://localhost:8080";

window.onload = function () {


    var ip = document.querySelector("#ip").value;
    socket = new MySocket(ip);
    socket.connect("pinball");


    socket.addEventListener("CONNECTING", function () {
        log("Try To Connect ...");
    });
    socket.addEventListener("ERROR", function () {
        log("ERROR");
    });
    socket.addEventListener("CLOSE", function () {
        log("Disconnected");
    });
    socket.addEventListener("CONNECTED", function () {
        log("Connected");
    });





    socket.addEventListener("MESSAGE", function (e) {
        if (!e.data) {
            return;
        }
        let response = JSON.parse(e.data);
        console.log(response);
        if (response.direction == "LEFT") {
            if (response.event == "DOWN") {
                hitLeft();
            } else {
                unhitLeft();
            }
        }
        if (response.direction == "RIGHT") {
            if (response.event == "DOWN") {
                hitRight();
            } else {
                unhitRight();
            }
        }
        if (response.direction == "LAUNCHER") {
            if (response.event == "UP") {
                if (response.strengh >= 700) {
                    response.strengh = 700;
                }

                animateLauncher(response.strengh);
            }
        }
        if (response.direction == "START") {
            setMessageText(response.direction);
        }
        if (response.direction == "RED") {
            setMessageText(response.direction);
        }
        if (response.direction == "BLUE") {
            setMessageText(response.direction);
        }
        if (response.direction == "WHITE") {
            setMessageText(response.direction);
        }

    })
}