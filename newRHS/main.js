// Main redhawksports.net site
var TOTAL_TABS = 6;
var CLOCK_FACES = ["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕚"] // unicode clocks
var tabNumber = 0;
var sideNumber = 0;
var liveScoresEnabled = false;
var usingBasic = false;
var cubeFaces = new Array(5);
function activateTab(tab)
{
	if(!usingBasic)
		setIndicatedTab(tab);
	showCubeSide(tab);
	setNCposition(tab);
	tabNumber = tab;
}
function clickTab(tab)
{
	if(tab == 0){
		window.location.href="/scoreboard";
		return;
	}
	
	activateTab(tab);
	writeCookie("season",""+tab,30);
}
function setIndicatedTab(tab)
{
	for(var x = 0; x < TOTAL_TABS; x++)
	{
		try{
			DGE("tab_MAIN"+x).className = "tabctl";
		}	catch(e){}
	}
	try{
		DGE("tab_MAIN"+tab).className = "tabctl selecttab";
	}	catch(e){console_log(e);}
}

function setLiveScoresEnabled(state)
{
	if(state)
		DGE("tab_MAIN0").style.display = "block";
	else
		DGE("tab_MAIN0").style.display = "none";
}
function setLiveCameraEnabled(state)
{
	if(state)
		DGE("tab_MAINCAM").style.display = "block";
	else
		DGE("tab_MAINCAM").style.display = "none";
}



function showCubeSide(side)
{
	sideNumber = side;
	var cube = DGE("cube");
	cube.className = "ss"+side;
	document.body.style.height = DGE("cubecontent"+side).scrollHeight;
}

var VISIT_REGISTERED = false;
function load()
{
	
	try{
		var el = document.body.lastElementChild;
		if(el.innerHTML.indexOf("000webhost.com/") > 0)
			el.style.display = "none";
	}catch(e){}
	
	
	if(!VISIT_REGISTERED)
	{
		VISIT_REGISTERED = true;
		var XHR = new XMLHttpRequest();
		XHR.open("GET","visit.php");
		XHR.send();

	}
	if(inIframe())
	{
		DGE("tab_ADMIN").style.visibility = "hidden";
		for(var x = 1; x < 6; x++)
			DGE("tab_MAIN"+x).style.width = "1.5vw";
	}
		
	for(var x = 1; x < 6; x++)
	{
		setCubeFaceContent(x, DGE("seasonData"+x).innerHTML);
	}
	var tabby = readCookie("season");
	if(tabby.length > 0 && parseInt(tabby) > 0)
		activateTab(parseInt(tabby));
	else
		activateTab(5); // TODO admin can set active tab
	checkBoard();
	setInterval(checkBoard, 20000);
	sizeCube();
}
function checkBoard(){
	getXHR("/scoreboard/check.php",function(client){
		setLiveScoresEnabled(parseInt(client.responseText) <= 60);
	});
	getXHR("/sendit/check.php",function(client){
		setLiveCameraEnabled(parseInt(client.responseText) <= 60);
	});
}




var DATE_INDEX = 0;
var TIME_INDEX = 1;
var NAME_INDEX = 2;
var INFO_INDEX = 3;
var ADDL_INFO_INDEX = 4;

function setCubeFaceContent(number, input)
{
	lines = input.split("\n"); // split input by newline
	cubeFaces[number] = lines;
	var result = ""; // variable to hold the finished html
	var line; // lines[x], split up by semicolon
	var Pline; // processed line
	var inTournament = false;
	var tournamentExpanded = false;
	for(var x = 0; x < lines.length; x++)
	{
		try{
			line = lines[x].split(";");
			if(line.length <= ADDL_INFO_INDEX)
				lines[x] = getBlankRowData();
			var line_length = line.length;
			for(var i = 0; i < line_length; i++)
				line[i] = line[i].replace(new RegExp("$AND", 'g'), '&amp;').replace(new RegExp("$SEMI", 'g'), ';');

				if(line[NAME_INDEX] === ""){
					inTournament = false;
					// when exiting tournament, insert empty resultsRow to keep the row and event number in sync
					result+="<div class='resultsrow' style='display: none'></div>";
					continue;
				}

			Pline = "<div class='resultsrow"; // begin generating HTML
			var boarded = false;
				if(line[ADDL_INFO_INDEX].indexOf("$scoreboardButton") > -1){
					Pline+=" boarded";
					boarded = true;
				}
				if(inTournament){
					if(tournamentExpanded)
						Pline+=" tournament";
					else
						Pline+=" tournament collapsed";
				}
				Pline+="'> <span class='eventdate'> 📅&nbsp;&nbsp;";
					Pline+=line[DATE_INDEX];
				Pline+="</span><span class='eventtime'>"+getClock(line[TIME_INDEX])+"&nbsp;&nbsp;";
					Pline+=line[TIME_INDEX];
				Pline+="</span><span class='eventname'> ";
					Pline+=line[NAME_INDEX];
				if(line[ADDL_INFO_INDEX].length > 0)
					Pline+="</span><span title='View stats and scores' class='eventinfo";
				else
					Pline+="</span><span class='eventinfo";
				if(line[ADDL_INFO_INDEX].length <= 1) Pline+=" noinfo";
				else Pline+=" hasinfo";
				if(inTournament) Pline+=" tournamentTitle";
				Pline+="' ";
				if(line[ADDL_INFO_INDEX].length > 1)
					Pline+="onclick='eventClick("+number+","+x+")'";
				Pline+="> "; // SPACING around link
				
				Pline+=line[INFO_INDEX];
				if(boarded) Pline+="&nbsp;&nbsp;&#x2211;";
									
									
									
				if(line[ADDL_INFO_INDEX].startsWith("$tournament")){
					tournamentExpanded = line[ADDL_INFO_INDEX].startsWith("$tournament expand");
					inTournament = true;
					Pline+="\u21c5&nbsp;<span style='font-size: 85%'></span>";
					var repl = cubeFaces[number][x].split(";");
					repl[ADDL_INFO_INDEX] = "$TournamentStart";
					cubeFaces[number][x] = repl.join(";");
				}
				
				
				
				
				Pline+="&nbsp;</span></a>";
				
			Pline+="</div> <div class='rowdivider'></div>";
			result+=Pline; // append to result
		}
		catch(e){console.error(e);}
	}
	DGE("cubecontent"+number).innerHTML = result;
}


function getClock(str)
{
	var num = str.split(":")[0];
	num = parseInt(num,10);
	try{
	if(!(isNaN(num) || num == 0 || num > 12))
	return CLOCK_FACES[num-1];
	}
	catch(e){;}
	return "🐌";
}

function getBlankRowData()
{
	return ";;;;";
}

function eventClick(season, row)
{
	var wTitle = cubeFaces[season][row].split(";")[INFO_INDEX];
	var wContent = cubeFaces[season][row].split(";");
	if(wContent[ADDL_INFO_INDEX].indexOf("$TournamentStart") > -1){
		toggleTournament(season, row);
	}
	else{
		enableModalWindow(wTitle);
		DGE("modalWinContent").innerHTML = processMessage(wContent[ADDL_INFO_INDEX], wContent);
	}
}
function toggleTournament(season, row){ // TODO account for blank rows above
	var list;
	if(usingBasic)
		list = document.getElementById("basic"+sideNumber);
	else{
		list = document.getElementById("cubecontent"+sideNumber);
	}
	list = list.getElementsByClassName("resultsrow");
	for(var x = row+1; x < list.length; x++){
		if(list[x].className.indexOf("tournament") == -1){
			break;
		}
		if(list[x].className.indexOf("collapsed") == -1)
			list[x].className+=" collapsed";
		else
			removeClass(list[x],"collapsed");
	}
}
function removeClass(ele,cls) {
	if (hasClass(ele,cls)) {
		var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		ele.className=ele.className.replace(reg,'');
	}
}
function hasClass(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
	
function processMessage(str,btnz)
{
	try{
		str = str.split("  ").join("&nbsp;&nbsp;"); // fix spacing
		
		while(str.indexOf("$scoreboardButton") > -1){
			var btn = btnz[0]+";"+btnz[1]+";"+btnz[2]+";"+btnz[3];
			var searchOpt = "$scoreboardButton=\"";
			var optIndex = str.indexOf(searchOpt)+searchOpt.length;
			var optionName = str.substring(optIndex);
			optionName = optionName.substring(0, optionName.indexOf("\""));
			if(optionName.length > 0){
				btn = "<br/><a class='livenote' target = '_blank' href='/scoreboard/?game="+window.btoa(btn+';'+optionName)+"'>"+optionName+" live scores</a>";
				var regex = /\$scoreboardButton=".+?"/g;
				var term = regex.exec(str);
				//console.log(term);
				var ind = str.indexOf(term[0]);
				str = str.substring(0,ind)+btn+str.substring(ind+term[0].length);
				//str = str.split(/\$scoreboardButton=".+?"/).join(btn);
			}
			else{
				btn = "<a class='livenote' target = '_blank' href='/scoreboard/?game="+window.btoa(btn)+"'>Click for live scores</a>";
				str = str.split("$scoreboardButton",2).join(btn);
			}
		}
		if(str.indexOf("<bracket8>")  > -1){
			var jsonData = str.split("<bracket8>")[1].split("</bracket8>")[0].replace(new RegExp("<br/>", 'g'), '').replace(new RegExp("#", 'g'), '$HASH');
			str = "<div id='modalframecontainer' class='iframeLoader'><iframe id='modaliframe' src='/brackets/bracket8.php?data="+encodeURI(jsonData)+"'></iframe></div>";
		}
		else if(str.indexOf("<bracket10>")  > -1){
			var jsonData = str.split("<bracket10>")[1].split("</bracket10>")[0].replace(new RegExp("<br/>", 'g'), '').replace(new RegExp("#", 'g'), '$HASH');
			str = "<div id='modalframecontainer' class='iframeLoader'><iframe id='modaliframe' src='/brackets/bracket10.php?data="+encodeURI(jsonData)+"'></iframe></div>";
		}
		else if(str.indexOf("<bracket8bb>")  > -1){
			var jsonData = str.split("<bracket8bb>")[1].split("</bracket8bb>")[0].replace(new RegExp("<br/>", 'g'), '').replace(new RegExp("#", 'g'), '$HASH');
			str = "<div id='modalframecontainer' class='iframeLoader'><iframe id='modaliframe' src='/brackets/bracket8bb.php?data="+encodeURI(jsonData)+"'></iframe></div>";
		}
		else{ // if not a bracket, add some padding
			str = "<div class='padded'>"+str+"<div>";
		}
	}
	catch(e){
		console.error(e);
		str = "!ERROR!";
	}
	return str;
}


function getXHR2(url, callback, param)
{
	var client = new XMLHttpRequest;
	client.open('GET', url);
	client.onloadend = function(){
		callback(client, param);
		};
	client.send();
}

function getXHR(url, callback)
{
	var client = new XMLHttpRequest;
	client.open('GET', url);
	client.onloadend = function(){
		callback(client);
		};
	client.send();
}


var animationTimer = 0;
function setAnimation(value)
{
	if(value)
		animationTimer = setInterval(function(){ animate(); }, 2000);
	else
		clearInterval(animationTimer);
}
function animate()
{
	tabNumber++;
	if(tabNumber > 5)
		tabNumber = 0;
	activateTab(tabNumber);
}

function DGE(str)
{
	return document.getElementById(str);
}

function mainScroll()
{
	if(usingBasic)
	{
		var threshold = window.innerHeight/3;
		var x = 0;
		for(x = 0; x < 6; x++)
			if(DGE("basic"+x).getBoundingClientRect().top > threshold)
				break;
		setIndicatedTab(x-1);
	}
}

function setNCposition(tab)
{
	try{
	var el = DGE("basic"+tab).getBoundingClientRect().top + window.scrollY;
	scrollTo(document.body,el - window.innerHeight/4,700);
	}
	catch(e){}
}

function toggleBasic()
{
	usingBasic = !usingBasic;
	
	if(!usingBasic) // TODO fix bottom branding occasionally moving to top
	{
		DGE("tab_SWITCH").innerHTML = "Disable 3D Cube";
		DGE("cubecenterer").style.display = "block";
		DGE("basichtml").innerHTML = ""; 
		DGE("bottombranding").style.display = "block";
		setIndicatedTab(tabNumber);
	}
	else
	{
		DGE("tab_SWITCH").innerHTML = "Enable 3D Cube";
		DGE("bottombranding").style.display = "none";
		var content = Array(6);
		for(var x = 0; x < 6; x++)
			content[x] = DGE("cubecontent"+x).innerHTML;
		DGE("cubecenterer").style.display = "none";
		var resultStr = "";
		for(var x = 0; x < 6; x++)
		{
			if(content[x].length > 1)
			{
				resultStr += "<h1>";
				resultStr += DGE("tab_MAIN"+x).innerHTML;
				resultStr += "</h1>";
			}
			resultStr += "<div class='basic' id='basic"+x+"'>";
			resultStr += content[x];
			resultStr += "</div>";
		}
		resultStr+="<div id='basicspacer' style='height: 50vh'></div>";
		resultStr+="<div class='branding'>"+DGE("bottombranding").innerHTML+"</div>";
		DGE("basichtml").innerHTML = resultStr;
		setTimeout(function(){mainScroll(); sizeCube();},100);
	}
}

function sizeCube() // dirty hack for apphole devices
{
	if(usingBasic)
	{
		DGE("basicspacer").style.height = window.innerHeight/2+"px";
		return;
	}
	var DEFAULT_CUBE_SIZE = 700000/window.innerWidth;
	var ratio = Math.max(window.innerWidth, window.innerHeight) / (DEFAULT_CUBE_SIZE+100);
	var el = DGE("cubecontainer");
	el.style.visibility = "visible";
	el.style.width = DEFAULT_CUBE_SIZE*ratio+"px";
	el.style.height = DEFAULT_CUBE_SIZE*ratio+"px";
	var els = document.getElementsByTagName("figure");
	for(var x = 0; x < els.length; x++)
	{
		el = els[x];
		el.style.width = DEFAULT_CUBE_SIZE*ratio+"px";
		el.style.height = DEFAULT_CUBE_SIZE*ratio+"px";
	}
	var c = DEFAULT_CUBE_SIZE/2*ratio;
	for(var x = 0; x  < 6; x++)
	{	
		var str;
		if(x == 0)
			str = "rotateY(0deg) translateZ("+c+"px)"
		else if(x == 1)
			str = "rotateX(180deg) translateZ("+c+"px)"
		else if(x == 2)
			str = "rotateY(90deg) translateZ("+c+"px)"
		else if(x == 3)
			str = "rotateY(-90deg) translateZ("+c+"px)"
		else if(x == 4)
			str = "rotateX(90deg) translateZ("+c+"px)"
		else
			str = "rotateX(-90deg) translateZ("+c+"px)"
		DGE("cf"+x).style.transform = str;
		DGE("cf"+x).style.WebkitTransform = str;
	}
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function writeCookie(key, value, expiry) {
	var date = new Date();
	date.setTime(date.getTime()+expiry*86400000);
	var expires = "expires="+date.toUTCString();
	document.cookie = key+"="+value+";"+expires+";path=/";
}

function readCookie(name) {
    name+="=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i=0;i<ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name)==0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function cacheKill()
{
	return "?" + new Date();
}
