<?php
$THIS_DIR = $_SERVER['DOCUMENT_ROOT'].$_SERVER['REQUEST_URI'];
$name = $_GET["name"];
if($name == FALSE){
	$files = scandir($THIS_DIR);
	foreach($files as $file){
		if(strpos(".*..*index.php",$file) === FALSE)
		$result = base64_decode($file, true);
		if($result)
			echo $result."<br/>";
	}
	echo "<br/>Use <strong>?name=&lt;<em>name of game</em>&gt;</strong> to get the results of a game";
}
else{
	echo file_get_contents(base64_encode($name));
}
?>