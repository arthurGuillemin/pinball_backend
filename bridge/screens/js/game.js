


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

window.onload = function () {
    socket = new ClientSocket();
    socket.connect("pinball");

    socket.addEventListener("MESSAGE", function (e) {
        if (!e.data) {
            return;
        }
        let response = JSON.parse(e.data);
        let keyInfo = JSON.parse(response.text);
        console.log(keyInfo);

        if (keyInfo.direction == "left") {
            if (keyInfo.type == "down") {
                hitLeft();
            } else {
                unhitLeft();
            }
        }
        if (keyInfo.direction == "right") {
            if (keyInfo.type == "down") {
                hitRight();
            } else {
                unhitRight();
            }
        }

    })

    // document.addEventListener("keyup", (event) => {
    //     if (event.key === "ArrowLeft") {
    //         unhitLeft();
    //     }
    //     if (event.key === "ArrowRight") {
    //         unhitRight();
    //     }
    // });

    // document.addEventListener("keydown", (event) => {
    //     if (event.key === "ArrowLeft") {
    //         hitLeft("left");
    //     }
    //     if (event.key === "ArrowRight") {
    //         hitRight("blue");
    //     }
    // });
}