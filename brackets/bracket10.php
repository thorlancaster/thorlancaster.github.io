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
			<?php echo file_get_contents("bracket10.css") ?>
			<?php echo file_get_contents("bracketglobal.css") ?>
		</style>
		<script type="text/javascript">
			var mouseX = 0;
			var mousey = 0;
			function calcMain(){
				document.body.style.height = window.innerHeight-20+"px";
			}
			function devClick(){
				console.log((mouseX/document.body.scrollWidth*200+1)+", "+mouseY/document.body.scrollHeight*100);
			}

		onmousemove = function(e){mouseX = e.clientX; mouseY = e.clientY};
		</script>
	</head>
	<body onload="calcMain()" onresize="calcMain()" style="background-color: #FFF">
		<div id="main">
		
			<svg id="bracketbg" version="1.1" viewBox="0,-0.2,200,99.8" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
				<?php
					// WINNERS
					echo svg_arrow(122,9,129,15); // bye and 1
					echo svg_arrow(122,25,129,19);
					
					echo svg_arrow(122,41,154,26.5); // 2 and 3
					echo svg_arrow(122,57,154,71);
					
					echo svg_arrow(122,73,129,79); // bye and 4
					echo svg_arrow(122,89,129,83);
					
					echo svg_arrow(172,25,179,44.6); // 11 and 12
					echo svg_arrow(172,73,179,53.1);
					
					echo svg_arrow(79,33,71.8,76.7); // 5 and 6
					echo svg_arrow(79,65,71.8,21.0);
					
					echo svg_arrow(147,17,154,23); // 7 and 8
					echo svg_arrow(147,81,154,74);
					
					echo svg_arrow(54,17,47,28.7); // 9 and 10
					echo svg_arrow(54,81,47,69);
					
					// LOSERS
					echo svg_arrow(104,25,97,28.8, true); // 1 and 2
					echo svg_arrow(104,41,97,37, true);
					
					echo svg_arrow(104,57,97,60.8, true); // 3 and 4
					echo svg_arrow(104,73,97,69, true);
					
					echo svg_arrow(29,33,22,45, true); // 13 and 14
					echo svg_arrow(29,65,22,53, true);
					
					echo svg_arrow(130,17,72,14.6, true); // 7 and 8 
					echo svg_arrow(130,81,72,82.7, true);
					
					echo svg_dotted_line(171.5,23,171.5,48); // 11 loser
					echo svg_dotted_line(171.5,48,60,48);
					echo svg_arrow(60,48,47,37 ,true);
					
					
					echo svg_dotted_line(171.5,69,171.5,50); // 12 loser
					echo svg_dotted_line(171.5,50,60,50);
					echo svg_arrow(60,50,47,60.7, true);
					
				?>
			</svg>
			
			<?php if(isset($data["info"])) echo tourney_annotation(2,0.5,$data["info"]); ?>
			
			<div id="tourncol1" class="tourncol">
				<?php
				echo tourney_game($data[16][0],"16",$data[16][1], $data[16][2], 45, $styles);
				?>
			</div>
			<div id="tourncol2" class="tourncol">
				<?php
				echo tourney_game($data[13][0],"13",$data[13][1], $data[13][2], 29, $styles);
				echo tourney_game($data[14][0],"14",$data[14][1], $data[14][2], 61, $styles);
				?>
			</div>
			<div id="tourncol3" class="tourncol">
				<?php
				echo tourney_game($data[9][0],"9",$data[9][1], $data[9][2], 13, $styles);
				echo tourney_game($data[10][0],"10",$data[10][1], $data[10][2], 77, $styles);
				?>
			</div>
			<div id="tourncol4" class="tourncol">
				<?php
				echo tourney_game($data[5][0],"5",$data[5][1], $data[5][2], 29, $styles);
				echo tourney_game($data[6][0],"6",$data[6][1], $data[6][2], 61, $styles);
				?>
			</div>
			<div id="tourncol5" class="tourncol">
				<?php
				echo tourney_game("","",$data[7][1],"Bye", 5, $styles);
				
				echo tourney_game($data[1][0],"1",$data[1][1], $data[1][2], 21, $styles);
				echo tourney_game($data[2][0],"2",$data[2][1], $data[2][2], 37, $styles);
				echo tourney_game($data[3][0],"3",$data[3][1], $data[3][2], 53, $styles);
				echo tourney_game($data[4][0],"4",$data[4][1], $data[4][2], 69, $styles);
				
				echo tourney_game("","","Bye",$data[8][2], 85, $styles);
				?>
			</div>
			<div id="tourncol6" class="tourncol">
				<?php
				echo tourney_game($data[7][0],"7",$data[7][1], $data[7][2], 13, $styles);
				echo tourney_game($data[8][0],"8",$data[8][1], $data[8][2], 77, $styles);
				?>
			</div>
			<div id="tourncol7" class="tourncol">
			<?php
				echo tourney_game($data[11][0],"11",$data[11][1], $data[11][2], 21, $styles);
				echo tourney_game($data[12][0],"12",$data[12][1], $data[12][2], 69, $styles);
				?>
			</div>
			<div id="tourncol8" class="tourncol">
				<?php
				echo tourney_game($data[15][0],"15",$data[15][1], $data[15][2], 45, $styles);
				?>
			</div>
		</div>
	</body>
</html>
