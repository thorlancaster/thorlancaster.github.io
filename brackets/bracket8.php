<?php
error_reporting(32768);
include("libbracket.php");

// entry point
$time_start = microtime(true); 
$data = json_decode(str_replace("\$AND", "&", str_replace("\$HASH", "#", $_GET["data"])), true);
$styles = parse_styles(file_get_contents("teamcolors.scs"));
?>

<html>
	<head>
		<style type="text/css">
			<?php echo file_get_contents("bracketglobal.css") ?>
			<?php echo file_get_contents("bracket8.css") ?>
		</style>
		<script type="text/javascript">
			function calcMain(){
				document.body.style.height = window.innerHeight-20+"px";
			}
		</script>
	</head>
	<body onload="calcMain()" onresize="calcMain()" style="background-color: #FFF">
		<div id="main">
		
			<svg id="bracketbg" version="1.1" viewBox="0,-0.2,200,99.8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
				<?php
					echo svg_arrow(50,9,70,14);
					echo svg_arrow(50,24,70,19);
					echo svg_arrow(50,39,70,44);
					echo svg_arrow(50,54,70,49);
					echo svg_arrow(50,72,70,71.5);
					echo svg_arrow(50,89,70,86.5);
					
					echo svg_arrow(100,17,120,29);
					echo svg_arrow(100,47,120,34.5);
					echo svg_arrow(100,74,120,79.5);
					echo svg_arrow(100,89,120,84);
					
					echo svg_line (158,81.5,148,81.5);
					echo svg_arrow(158,81.5,134,62);
					
					echo svg_arrow(150,32,170,43);
					echo svg_arrow(150,58,170,47);
				?>
			</svg>
			
			<?php if(isset($data["info"])) echo tourney_annotation(18,0.5,$data["info"]); ?>

			<div id="tourncol1" class="tourncol">
				<?php echo tourney_game($data[1][0],"1",$data[1][1], $data[1][2], 5, $styles);
					echo tourney_game($data[2][0],"2",$data[2][1], $data[2][2], 20, $styles);
					echo tourney_game($data[3][0],"3",$data[3][1], $data[3][2], 35, $styles);
					echo tourney_game($data[4][0],"4",$data[4][1], $data[4][2], 50, $styles);
					echo tourney_game($data[7][0],"7",$data[7][1], $data[7][2], 70, $styles);
					echo tourney_game($data[8][0],"8",$data[8][1], $data[8][2], 85, $styles)?>
			</div>
			<div id="tourncol2" class="tourncol">
				<?php echo tourney_game($data[5][0],"5",$data[5][1], $data[5][2], 13, $styles);
					echo tourney_game($data[6][0],"6",$data[6][1], $data[6][2], 43, $styles);
					echo tourney_game($data[9][0],"9",$data[9][1], $data[9][2], 70, $styles);
					echo tourney_game($data[10][0],"10",$data[10][1], $data[10][2], 85, $styles)?>
			</div>
			<div id="tourncol3" class="tourncol">
				<?php
					echo tourney_game($data[11][0],"11",$data[11][1], $data[11][2], 28, $styles);
					echo tourney_game($data[13][0],"13",$data[13][1], $data[13][2], 54, $styles);
					echo tourney_game($data[12][0],"12",$data[12][1], $data[12][2], 78, $styles)?>
			</div>
			<div id="tourncol4" class="tourncol">
				<?php
					echo tourney_game($data[14][0],"14",$data[14][1], $data[14][2], 41, $styles);
					echo tourney_game($data[15][0],"15",$data[15][1], $data[15][2], 56, $styles)?>
			</div>
		</div>
	</body>
</html>
<?php
//echo 'Generated in ' . (microtime(true) - $time_start). " seconds by RHS bracket builder";
?>
