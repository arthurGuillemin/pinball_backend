


let rotate_red = false;

function rotateRedBox() {
    rotate_red = !rotate_red;
    document.querySelector("#red").classList.toggle("rotated", rotate_red);
}

let rotate_blue = false;

function rotateBlueBox() {
    rotate_blue = !rotate_blue;
    document.querySelector("#blue").classList.toggle("rotated", rotate_blue);
}



var socket;

window.onload = function () {


    socket = new ClientSocket();
    socket.connect("pinball");

    socket.addEventListener("MESSAGE", function (e) {
        console.log(e);
        if (!e.data) {
            return;
        }
        //const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
        let response = JSON.parse(e.data);
        console.log(response.text);
        if (response.text == "left") {
            rotateBlueBox();
        } else if (response.text == "right") {
            rotateRedBox();
        }

        // console.log(obj);

    })












    // document.addEventListener("keyup", (event) => {
    //     if (event.key === "ArrowUp") {
    //         rotateBlueBox();
    //     }

    //     if (event.key === "ArrowDown") {
    //         rotateRedBox();
    //     }

    // });


}