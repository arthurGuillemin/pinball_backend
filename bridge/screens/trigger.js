


var socket;
let uri = "ws://locahost:8080";
uri = "ws://10.92.254.238:8080";


window.onload = function () {
    socket = new ClientSocket(uri);
    console.log(socket);
    socket.connect("trigger");

    let left_btn = document.querySelector("#left");
    let right_btn = document.querySelector("#right");

    left_btn.addEventListener("click", function () {
        socket.sendMessage("left", "pinball");

    })
    right_btn.addEventListener("click", function () {
        socket.sendMessage("right", "pinball");

    })

    document.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") {
            console.log("left");
            socket.sendMessage("left", "pinball");

        }

        if (event.key === "ArrowRight") {
            console.log("Right");
            socket.sendMessage("right", "pinball");
        }

    });


}
