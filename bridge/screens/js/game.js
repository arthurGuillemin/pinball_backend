let rotate_red = false;

function rotateRedBox() {
    rotate_red = !rotate_red;
    document.querySelector("#red").classList.toggle("redRotated", rotate_red);
}

let rotate_blue = false;

function rotateBlueBox() {
    rotate_blue = !rotate_blue;
    document.querySelector("#blue").classList.toggle("rotated", rotate_blue);
}
function hitRight(buttonId) {
    document.querySelector("#right").style.transform = "rotate(65deg)";
}
function unhitRight(buttonId) {
    document.querySelector("#right").style.transform = "rotate(0deg)";
}
function hitLeft(buttonId) {
    document.querySelector("#left").style.transform = "rotate(-65deg)";
}
function unhitLeft(buttonId) {
    document.querySelector("#left").style.transform = "rotate(0deg)";
}


var socket;
var uri = "ws://localhost:8080";

window.onload = function () {
    socket = new MySocket();
    socket.connect("pinball");

    socket.addEventListener("MESSAGE", function (e) {
        if (!e.data) {
            return;
        }
        let response = JSON.parse(e.data);
        // console.log(response);
        if (response.direction == "left") {
            if (response.event == "key_down") {
                hitLeft();
            } else {
                unhitLeft();
            }
        }
        if (response.direction == "right") {
            if (response.event == "key_down") {
                hitRight();
            } else {
                unhitRight();
            }
        }
    })
}