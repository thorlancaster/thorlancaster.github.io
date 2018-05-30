<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// redirect to HTTPS
if(empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] != "on"){
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: ' . $redirect);
    die();
}
?>

<html>
<head>
	<title>Live Score Cam</title>
	<style>
		body{
			margin: 0px;
			background: linear-gradient(#000, #023);
		}
		#picCanvas{
			position: fixed;
			width: 100%;
			height: 100%;
		}
		#ctlCanvas{
			position: fixed;
			width: 100%;
			height: 2em;
		}
		#loaderImage{
			display: none;
		}
	</style>
</head>
<body onload="init()" onresize="handleResize()">
	<img id="loaderImage" />
	<canvas id="picCanvas"></canvas>
	<canvas id="ctlCanvas"></canvas>
	<script src="client.js"></script>
	<script>setTimeout(function(){window.onfocus = function(){handleResize()}}, 100);</script>
</body>
