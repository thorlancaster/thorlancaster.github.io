<?php
	$archivename = $_GET["archivename"];
	if(!isset($archivename))
		die("a required parameter <strong>archivename</strong> is missing");
	$filesource = "cache";
	
	$zip = new ZipArchive();
	$zip->open($archivename, ZipArchive::CREATE);
	
	print_r($zip);
	
	$files = scandir($filesource);
	$number = 0;
	foreach($files as $file){
		if($file != null && $file != "." && $file != ".."){
			echo "Zipping ".$file."<br/>";
			if($zip->addFile($filesource.'/'.$file, $number))
				unlink($filesource.'/'.$file);
			$number++;
		}
	}
	unset($file);
	
	$ru = getrusage();
	echo("Zipped Up $number files in ".$ru["ru_utime.tv_usec"]/1000 . "ms");
?>
