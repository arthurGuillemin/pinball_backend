<?php
require_once("./top.php");
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <script src="./js/mySocket.js" defer></script>
    <script src="./js/game.js" defer></script>

    
    <title>PinBall</title>
    <style>
        body {
            background: #111;
            color: white;
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 50vh;
            gap: 20px;
        }

        .box {
            width: 320px;
            height: 40px;
            background: #ffcc00;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: transform 0.2s ease;
            transform-origin: left;
            rotate: 37.5deg;
        }

        #right {
            position: relative;
            top: 40px;
            left: 380px;
            transform-origin: right;
            rotate: -37.5deg;
        }

        .rotated {
            transform: rotate(90deg);
        }

        .redRotated {
            transform: rotate(-90deg);
        }

        .container {
            position: relative;
            justify-content: center;
            float: left;
        }

        #launcher {
            width: 30px;
            height: 300px;
            background-color: red;
            position: absolute;
            left: 150px;
            border-radius: 20px;
            top: 300px;
        }

        #message {
            font-weight: bolder;
            font-size: 100px;
            position: absolute;
            top: 50px;
        }

        #log {
            background-color: black;
            color: white;
            position: absolute;
            top: 0px;
            left: 0px;
        }
    </style>
</head>

<body>
    <div id="log">

    </div>
    <div id="message">

    </div>

    <form action="?" method="get">

        <input type="text" style="width: 400px;" value="<?= $ip ?>" name="ip" id="ip" />
        <input type="submit" value="Send" />

    </form>
    <br />
    <div id="launcher">

    </div>

    <div class="container">
        <div id="right" class="box">
            <p>Right</p>
        </div>




        <div id="left" class="box">
            <p>Left</p>
        </div>
    </div>






</body>

</html>