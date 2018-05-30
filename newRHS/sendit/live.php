<?php
$param = "live.jpg";
$ending = ".jpg";
if($ending == ".jpg" || $ending == ".jpeg")
	header("Content-Type: image/jpeg");
if($ending == ".png")
	header("Content-Type: image/png");

flock(fopen($param, "r"), LOCK_SH);
echo file_get_contents($param);
flock(fopen($param, "r"), LOCK_UN);
?>