<?php
	$rtn = file_get_contents("score.txt")."<\$fileDivider>".file_get_contents("score.realclear");
	$hash = hash("sha256",$rtn);
	if($hash == $_GET["hash"]){
		header("HTTP/1.0 304 Not Modified");
		echo("Not modified");
	}
	else echo $rtn;
?>