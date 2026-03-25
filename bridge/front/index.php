<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>mySocket</title>

    <script type="text/javascript" src="./js/mySocket.js" defer></script>
    <script type="text/javascript" src="./js/userful_functions.js" defer></script>
    <script type="text/javascript" src="./js/main.js" defer></script>
</head>

<body>
    id <input type="text" id="id_client" />
    <button id="connect_btn">Connect</button>
    <hr />
    <br /><br />
    Message
    <input rows="6" cols="50" id="textarea" name="text" type="text"></input>
    <br /><br />
    à <input type="text" id="to" />
    <button id="send_btn">Send</button>
    <hr />
    <p><button id="close_btn">Close Connection</button></p>
    <h1>Result</h1>
    <div id="result">Result</div>
</body>

</html>