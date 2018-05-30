<?php

function bracket_process($str){
	return str_replace("<br/>", "", str_replace("<br>", "", str_replace("\$AND", "&", str_replace("\$HASH", "#", $str))));
}

function tourney_game($gtime, $gname, $team1, $team2, $ypos, $styleset){
        $team1f = str_replace(" ", "&nbsp;", $team1);
        $team2f = str_replace(" ", "&nbsp;", $team2);
	$innerHTML = "<div style='".team_style($team1, $styleset)."' class='tourngameteam1'>{$team1f}</div><div style='".team_style($team2, $styleset)."' class='tourngameteam2'>{$team2f}</div><divider></divider>";
	$innerHTML .= "<div class='tourngametime'>{$gtime}</div><div class='tourngamename'>{$gname}</div>";
	return "<div class='tourngame' style='top: {$ypos}%'>{$innerHTML}</div>";
}

function team_style($name, $styleset){
	foreach($styleset as &$style){
		if(strpos($name, $style[0]) === 0){
			return " color: {$style[1]}; background-color: {$style[2]}; ";
		}
	}
	return " ";
}

function parse_styles($contents){
	$entries = explode("\n", $contents);
	$rtn = [];
	foreach($entries as &$entry){
		if($entry[0] !== "#"){
			$args = explode(",", $entry);
			array_push($rtn, $args);
		}
	}
	return $rtn;
}

function svg_arrow($x1,$y1,$x2,$y2, $dotted = false){
	$xfactor = -1.5;
	$yfactor = -2;
	$theta = atan2($y2-$y1, $x2-$x1);
	$th1 = $theta + 0.6;
	$th2 = $theta - 0.6;
	$p1x = cos($th1)*$xfactor;
	$p1y = sin($th1)*$yfactor;
	$p2x = cos($th2)*$xfactor;
	$p2y = sin($th2)*$yfactor;
	if($dotted)
		return svg_dotted_line($x1,$y1,$x2,$y2) . svg_line($x2+$p1x,$y2+$p1y,$x2,$y2) . svg_line($x2+$p2x,$y2+$p2y,$x2,$y2);
	else
		return svg_line($x1,$y1,$x2,$y2) . svg_line($x2+$p1x,$y2+$p1y,$x2,$y2) . svg_line($x2+$p2x,$y2+$p2y,$x2,$y2);
}
function svg_line($x1,$y1,$x2,$y2){
	return "<line x1='$x1' y1='$y1' x2='$x2' y2='$y2' style='stroke:rgb(0,0,0);stroke-width:0.3' />";
}
function svg_dotted_line($x1,$y1,$x2,$y2){
	return "<line x1='$x1' y1='$y1' x2='$x2' y2='$y2' stroke-dasharray='0.7,0.7' style='stroke:rgb(0,0,0);stroke-width:0.3' />";
}

function tourney_annotation($x1, $y1, $text){
	return "<div style='position: absolute; top: {$y1}%; left: {$x1}%;'>$text </div>";
}
?>