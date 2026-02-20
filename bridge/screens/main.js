


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





window.onload = function () {


    var blue = document.querySelector("#blue");


    document.addEventListener("keyup", (event) => {
        if (event.key === "ArrowUp") {
            rotateBlueBox();
        }

        if (event.key === "ArrowDown") {
            rotateRedBox();
        }

    });


}