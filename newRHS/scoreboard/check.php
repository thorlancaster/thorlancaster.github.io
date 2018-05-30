<?php
date_default_timezone_set("America/Denver");
$target = "score.txt";
if(file_exists("board.en"))
	echo time() - filemtime($target);
else
	echo "9999";