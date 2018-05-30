<?php
header('Content-Type: text/cache-manifest');
echo "CACHE MANIFEST\n";
function create_manifest($fileList) {
	$hash = "";
	foreach ($fileList as $file) {
		echo str_replace(' ', '%20', $file) . "\n";
		if(strpos($file,"/") !== 0) // TODO image.php linked images
			if(file_exists($file))
				$hash .= md5_file($file);
		else
			if(file_exists($_SERVER[DOCUMENT_ROOT] . $file))
				$hash .= md5_file($_SERVER[DOCUMENT_ROOT] . $file);
	}
	return $hash;
}
$hashes = create_manifest(file("manifest.mf", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
// Write the $hashes string
echo "# Hash: " .md5($hashes) . "\n";
echo "NETWORK:\n*";
?>