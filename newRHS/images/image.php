<?php
$param = $_GET["url"];
$ending = strtolower(substr($param,strrpos($param,".")));
if($ending == ".jpg" || $ending == ".jpeg")
	header("Content-Type: image/jpeg");
if($ending == ".png")
	header("Content-Type: image/png");

echo file_get_contents($param);
?>