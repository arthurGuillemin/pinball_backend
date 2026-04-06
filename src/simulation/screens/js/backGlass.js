


var uri = "ws://localhost:8080";
var socket;


window.onload = function () {

    socket = new MySocket();
    socket.connect("backGlass");

    socket.addEventListener("message", function (e) {
        console.log(e.data);
        document.querySelector("body").textContent = e.data;

    })


    

}