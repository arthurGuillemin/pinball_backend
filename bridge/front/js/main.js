
var socket;
var uri = "ws://localhost:8181";


window.onload = function () {

    socket = new MySocket(uri);

    let connect_btn = document.querySelector("#connect_btn");
    let send_btn = document.querySelector("#send_btn");
    let close_btn = document.querySelector("#close_btn");
    let id_client_txt = document.querySelector("#id_client");
    let to_txt = document.querySelector("#to");


    close_btn.addEventListener("click", function () {
        socket.close();
    })

    connect_btn.addEventListener("click", function () {
        socket.connect(id_client_txt.value);
        socket.addEventListener("MESSAGE", function (e) {
            console.log(e.data);
            addText(e.data);
        })
        socket.addEventListener("CLOSE", function (e) {
            console.log("CLOSED...");
        })
    })

    send_btn.addEventListener("click", function () {
        let message = document.querySelector("#textarea").value;
        socket.sendMessage({
            "type": "message",
            "message": message,
            "to": to_txt.value
        });
    })
}




function addText(text) {
    const div = document.getElementById("result");
    div.innerHTML += "<p>" + text + "</p>";
}