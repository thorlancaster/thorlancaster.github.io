<?php
date_default_timezone_set("America/Denver");
$target = "live.jpg";
if(file_exists($target))
	echo time() - filemtime($target);
else
	echo "9999";