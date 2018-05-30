<?php
	$filename = "live.jpg";
	
	$data = $_POST["data"];
	if($data == null)
		die("FAIL<br/><h1>WHAT ARE YOU DOING?!!!</h1>");
	$decoded = base64_decode($data);
	flock(fopen($filename, "r"), LOCK_EX);
	file_put_contents($filename, $decoded);
	flock(fopen($filename, "r"), LOCK_UN);
		echo("OK<br/>Successfully added file");
?>