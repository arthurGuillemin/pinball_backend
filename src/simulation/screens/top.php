<?php
function pri($tab)
{
    echo "<pre />";
    print_r($tab);
    echo "<pre />";
}
$ip = "ws://batna.freemyip.com:8080";
if (isset($_GET['ip']))
{
    $ip = $_GET['ip'];
    setcookie("ip", $ip, time() + 999999999);
    redirection();
}


if (isset($_COOKIE['ip']))
{
    $ip = $_COOKIE['ip'];
}





function redirection()
{
    header("Location: ?");
}
