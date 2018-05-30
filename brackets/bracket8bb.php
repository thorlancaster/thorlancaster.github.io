<?php
error_reporting(32768);
include("libbracket.php");

// entry point
$time_start = microtime(true); 
$data = json_decode(bracket_process($_GET["data"]), true);
$styles = parse_styles(file_get_contents("teamcolors.scs"));
?>

<html>
	<head>
		<style type="text/css">
			<?php echo file_get_contents("bracketglobal.css") ?>
			<?php echo file_get_contents("bracket8bb.css") ?>
		</style>
		<script type="text/javascript">
			var mouseX = 0;
			var mousey = 0;
			function calcMain(){
				document.body.style.height = window.innerHeight-20+"px";
			}
			function devClick(){
				console.log((mouseX/document.body.scrollWidth*200-0.25)+", "+mouseY/document.body.scrollHeight*100+0.5);
			}

		onmousemove = function(e){mouseX = e.clientX; mouseY = e.clientY};
		</script>
	</head>
	<body onload="calcMain()" onresize="calcMain()" onclick="devClick()" style="background-color: #FFF">
		<div id="main">
		
			<svg id="bracketbg" version="1.1" viewBox="0,-0.15,200,99.85" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
				<?php
					echo svg_arrow(133,14,142,23); // 1 and 2
					echo svg_arrow(133,38,142,29);
					echo svg_arrow(133,62,142,71); // 3 and 4
					echo svg_arrow(133,86,142,77);
					
					echo svg_arrow(166,26,175,45.7); // to championship
					echo svg_arrow(166,74,175,54.1);
					
					echo svg_arrow(76,26,67,33.8); // winners of 2&thru games
					echo svg_arrow(76,74,67,66);
					
					echo svg_arrow(43,38,34,46); // advancing to consolation
					echo svg_arrow(43,62,34,54);
					
					echo svg_arrow(109,14,100,23, true); // initial losers 1,2
					echo svg_arrow(109,38,100,29, true);
					echo svg_arrow(109,62,100,71, true); // initial losers 3,4
					echo svg_arrow(109,86,100,77, true);
					
					echo svg_dotted_line(163,30,156,44);
					echo svg_arrow(156,44,67,57.8, true);
					echo svg_dotted_line(163,70,156,56);
					echo svg_arrow(156,56,67,42, true);
				?>
			</svg>
			
			<?php if(isset($data["info"])) echo tourney_annotation(1,0.5,$data["info"]); ?>

			<div id="tourncol1" class="tourncol">
				<?php 
					echo tourney_game($data[11][0],"11",$data[11][1], $data[11][2], 46, $styles);
					echo tourney_game($data[13][0],"13",$data[13][1], $data[13][2], 82, $styles);
					?>
			</div>
			<div id="tourncol2" class="tourncol">
				<?php 
					echo tourney_game($data[10][0],"10",$data[10][1], $data[10][2], 34, $styles);
					echo tourney_game($data[9][0],"9",$data[9][1], $data[9][2], 58, $styles);
					?>
			</div>
			<div id="tourncol3" class="tourncol">
				<?php
					echo tourney_game($data[5][0],"5",$data[5][1], $data[5][2], 22, $styles);
					echo tourney_game($data[6][0],"6",$data[6][1], $data[6][2], 70, $styles);
					?>
			</div>
			<div id="tourncol4" class="tourncol">
				<?php
					echo tourney_game($data[1][0],"1",$data[1][1], $data[1][2], 10, $styles);
					echo tourney_game($data[2][0],"2",$data[2][1], $data[2][2], 34, $styles);
					echo tourney_game($data[3][0],"3",$data[3][1], $data[3][2], 58, $styles);
					echo tourney_game($data[4][0],"4",$data[4][1], $data[4][2], 82, $styles);
					?>
			</div>
			<div id="tourncol5" class="tourncol">
				<?php
					echo tourney_game($data[7][0],"7",$data[7][1], $data[7][2], 22, $styles);
					echo tourney_game($data[8][0],"8",$data[8][1], $data[8][2], 70, $styles);
					?>
			</div>
			<div id="tourncol6" class="tourncol">
				<?php
					echo tourney_game($data[12][0],"12",$data[12][1], $data[12][2], 46, $styles);
					?>
			</div>
		</div>
	</body>
</html>
<?php
//echo 'Generated in ' . (microtime(true) - $time_start). " seconds by RHS bracket builder";
?>
