


var socket;
let uri = "ws://localhost:8080";



window.onload = function () {
    socket = new ClientSocket();
    socket.connect("trigger");
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
