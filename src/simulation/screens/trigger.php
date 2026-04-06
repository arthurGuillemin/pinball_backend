<?php
require_once("./top.php");

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="./js/trigger.js"></script>
    <script src="./js/mySocket.js"></script>
    <title>Trigger</title>
</head>
<style>
    #red {
        background-color: red;
    }


    
    #white {
        background-color: white;
    }

    #blue {
        background-color: blue;
    }

    #log {
        background-color: black;
        color: white;
    }
</style>

<body>
    <div id="log">

    </div>
    <br />
    <form action="?" method="get">

        <input type="text" style="width: 400px;" value="<?= $ip ?>" name="ip" id="ip" />
        <input type="submit" value="Send" />

    </form>
    <br />


    <input style="padding: 50px;" type="button" value="Left" id="left" />
    <input style="padding: 50px; margin-left: 50px;" type="button" value="Right" id="right" />

    <br />
    <br />
    <br />


    <br />
    <br />
    <br />
    <input style="padding: 70px; margin-left: 50px;" type="button" value="LUNCHER" id="luncher" />


    <br />
    <br />
    <br />
    <input style="padding: 50px;" type="button" value="START" id="start" />
    <input style="padding: 50px;" type="button" value="RED" id="red" />
    <input style="padding: 50px;" type="button" value="WHITE" id="white" />
    <input style="padding: 50px;" type="button" value="BLUE" id="blue" />
    <br />
    <br />


</body>

</html>