var mouseX = null;
var mouseY = null;
var xmlHttp = null;

window.oncontextmenu = function(e){
	return RChandler(e);
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
document.onmousemove = function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
	ss247.mouseMoved();
}
var SS247 = function()
{
	var seasonStatus;
	var seasonAccel;
	var seasonHeights;
}
SS247.prototype.setQNAME = function(qqnam)
{
	QNAME = qqnam;
}
SS247.prototype.showSeason = function(season)
{
	seasonAccel[season] = 1;
	setSBTNstatus(season,1);
}
SS247.prototype.hideSeason = function(season)
{
	seasonAccel[season] = 0;
	setSBTNstatus(season,0);
}
SS247.prototype.showSeasonImm = function(season)
{
	seasonAccel[season] = 1;
	seasonStatus[season] = 1;
	QNAME.adjustSeason(season,seasonStatus[season]);
	setSBTNstatus(season,1);
}
SS247.prototype.hideSeasonImm = function(season)
{
	seasonAccel[season] = 0;
	seasonStatus[season] = 0;
	QNAME.adjustSeason(season,seasonStatus[season]);
	setSBTNstatus(season,0);
}
function setSBTNstatus(season, state)
{
	if(state)
	{
	QNAME.getSeason(season).querySelectorAll("button")[0].style.display = "none";
	QNAME.getSeason(season).querySelectorAll("button")[1].style.display = "inline";
	}
	else
	{
	QNAME.getSeason(season).querySelectorAll("button")[0].style.display = "inline";
	QNAME.getSeason(season).querySelectorAll("button")[1].style.display = "none";
	}
}
SS247.prototype.seasonVisible = function(season)
{
	return QNAME.getSeason(season).querySelector("ul").style.display != "none";
}
SS247.prototype.getSeason = function(season)
{
	if(season == 0)
		return document.getElementById("crossCountry");
	if(season == 1)
		return document.getElementById("football");
	if(season == 2)
		return document.getElementById("volleyball");
	if(season == 3)
		return document.getElementById("basketball");
	if(season == 4)
		return document.getElementById("track");
	return null;
}
SS247.prototype.mouseMoved = function()
{
}
	
	
	
SS247.prototype.mainLoop = function()
{
	for(var x = 0; x < 5; x++)
	{
		if(seasonStatus[x] != seasonAccel[x])
		{
			if(seasonStatus[x] < seasonAccel[x])
			{
				seasonStatus[x]+=0.02;
				QNAME.adjustSeason(x,seasonStatus[x]);
			}
			if(seasonStatus[x] > seasonAccel[x])
			{
				seasonStatus[x]-=0.02;
				QNAME.adjustSeason(x, seasonStatus[x]);
			}
			if(seasonStatus[x] - seasonAccel[x] < 0.031 && seasonAccel[x] - seasonStatus[x] < 0.031)
			{
				seasonStatus[x] = seasonAccel[x];
				QNAME.adjustSeason(x,seasonAccel[x]);
			}
		}
	}
}


	
SS247.prototype.adjustSeason = function(season,position)
{
	if(position < 0.5)
	{
		QNAME.getSeason(season).querySelector("div").style.height = seasonHeights[season]*position*2+"px";
		if(position < 0.05)
			QNAME.getSeason(season).querySelector("div").style.height = "0px";
		QNAME.getSeason(season).querySelector("ul").style.display = "none";
	}
	else
	{
		QNAME.getSeason(season).querySelector("div").style.height = 0;
		QNAME.getSeason(season).querySelector("ul").style.display = "";
		QNAME.getSeason(season).querySelector("ul").style.opacity = (position-0.5)*2;
		seasonHeights[season] = (QNAME.getSeason(season).querySelector("ul").offsetHeight);
		QNAME.getSeason(season).querySelector("ul").style.marginLeft = (1-position)*(window.innerWidth*0.7)+"px";
		//QNAME.getSeason(SHid).querySelector("ul").style.opacity = (showVal/50);
	}
}
	
SS247.prototype.setup = function()
{
	window.setInterval(function(){QNAME.mainLoop()},30); // 60 FPS, 17
	window.setTimeout(function(){checkForMalware()},3000);
	window.setTimeout(function(){checkForMalware()},7000);
	seasonStatus = new Array(5);
	seasonAccel = new Array(5);
	seasonHeights = new Array(5);
	for(var x = 0; x < 5; x++)
	{
		seasonStatus[x] = 1;
		seasonAccel[x] = 1;
		seasonHeights[x] = 100;
	}
}


var SSLoader = function()
{
	var state = 0;
	var teamStack;
	var redo = false;
}
SSLoader.prototype.setup = function()
{
	window.setInterval(function(){LNAME.mainLoop()},33.3334); // 10 FPS, 100
	state = 0;
	teamStack = new Array(7);
	teamStack[0] = ""; // Team MF
	teamStack[1] = ""; // Team license
	teamStack[2] = ""; // Team games GDI
	teamStack[3] = ""; // Team realClear
	teamStack[4] = new Array(5); // Team games decoded
	teamStack[5] = new Array(5); // Team game details
	teamStack[6] = new Array(5); // Team game titles
	for(var x = 0; x < 5; x++)
	{
		teamStack[4][x] = new Array(0);
		teamStack[5][x] = new Array(0);
		teamStack[6][x] = new Array(0);
	}
}
var badLoad = false;
SSLoader.prototype.mainLoop = function()
{
	if(badLoad)
		return;
try{
	 // 0=waiting for manifest, 1=waiting for license, 2-waiting for games 3=waiting for realClear
	if(state == 0)
	{
		if(XHRLoadFinished()) // we've loaded the manifest, start the license
		{
			teamStack[0] = getLoadText();
			//console.log(teamStack[0]);
			state++;
			LNAME.load(teamStack[0][3]);
		}
	}
	if(state == 1)
	{
		if(XHRLoadFinished()) // we've loaded the license, start the games
		{
			teamStack[1] = getLoadText();
			if(teamStack[1].length > 10)
			{
				for(var i = 0; i < 5; i++)
				{
					if(teamStack[1][i+6].indexOf("0") > -1)
						QNAME.hideSeasonImm(i);
					else
						QNAME.showSeason(i);
				}
			}
			//console.log(teamStack[1]);
			state++;
			LNAME.load(teamStack[0][4]);
		}
	}
	if(state == 2)
	{
		if(XHRLoadFinished()) // we've loaded the games, start the realClear
		{
			teamStack[2] = getLoadText();
//			if((!(teamStack[2][teamStack[2].length-1] === "#end")))
//			{
//				window.location.reload();
//			}
			//console.log(teamStack[2]);
			for(var x = 0; x < teamStack[2].length; x++) // sanitize the file to prevent exceptions
			{
				if(teamStack[2][x].indexOf("<R>") < 0 && teamStack[2][x].indexOf("<S>") < 0)
				{
					if(teamStack[2][x].indexOf("#end") != 0)
					console.log("BAD LINE: "+x);
					teamStack[2][x] = teamStack[2][x]+"<R>";
				}
			}
			for(var i = 0; i < teamStack[2].length; i++)
				teamStack[2][i] = teamStack[2][i].replaceAll("<T>","&nbsp&nbsp&nbsp");
			state++;
			LNAME.load(teamStack[1][4]);
		}
	}
	if(state == 3)
	{
		if(XHRLoadFinished()) // we've loaded the realClear
		{
			teamStack[3] = getLoadText();
			//console.log(teamStack[3]);
			state++;
		}
	}
	if(state == 4)
	{
		document.getElementById("teamName").innerHTML = teamStack[1][0];
		var SPTR = 0;
		for(var x = 0; x < teamStack[2].length; x++)
		{
			if(teamStack[2][x].indexOf("<S>") > -1)
			{
				SPTR++;
			}
			else
			{
				teamStack[4][SPTR].push(teamStack[2][x]);
			}
		}
		//console.log("Compiled to");
		//console.log(teamStack[4]);
		for(var x = 0; x < 5; x++)
		{
			var Scontents = Array(0);
			for(var y = 0; y < teamStack[4][x].length; y++)
			{
				Scontents.push(teamStack[4][x][y].split('<R>')[0]);
				if(teamStack[4][x][y].split('<R>')[1].length > 1)
				   teamStack[5][x].push("<br/><br/>"+teamStack[4][x][y].split('<R>')[1].replaceAll("<N>","<br/>").replaceAll("<T>","|&nbsp&nbsp&nbsp&nbsp"));
			    else
					teamStack[5][x].push(teamStack[4][x][y].split('<R>')[1].replaceAll("<N>","<br/>").replaceAll("<T>","|&nbsp&nbsp&nbsp&nbsp"));
				teamStack[6][x].push(teamStack[4][x][y].split('<R>')[0]);
			}
			Scontents = "<li>"+Scontents.join("~").replaceAll("~","</li><br/><li>")+"</li>";
			//console.log(Scontents);
			QNAME.getSeason(x).querySelector("ul").innerHTML = Scontents;
		}
			for(var x = 0; x < teamStack[3].length; x++)
		{
			var query = teamStack[3][x].substring(0, teamStack[3][x].indexOf("*"));
			var addend = teamStack[3][x].substring(teamStack[3][x].indexOf("*"));
			for(var y = 0; y < 5; y++)
			{
				for(var z = 0; z < teamStack[6][y].length; z++)
				{
					if(teamStack[6][y][z].indexOf(query) == 0)
						teamStack[5][y][z] = teamStack[5][y][z]+"<br/><iframe allowfullscreen width='100%' src='realclear.html' data-realclear-sources='"+addend+"'</iframe>";
				}
			}
		}
		//console.log(teamStack[5]);
		for(var x = 0; x < 5; x++)
		{
			var items = QNAME.getSeason(x).querySelector("ul").querySelectorAll("li");
			for(var y = 0; y < items.length; y++)
			{
				if(teamStack[5][x][y] && teamStack[5][x][y].length > 1)
				{
					items[y].style.cursor = "pointer";
					items[y].style.textDecoration = "underline";
					items[y].outerHTML = items[y].outerHTML.substring(0,3)+" onMouseOver='this.style.color=\"#0F0\"; this.style.animationName = \"\"' onMouseOut = 'this.style.animationName = \"linkFade\"; this.style.removeProperty(\"color\")'  onclick=\"showModalWindow("+x+","+y+")\" "+items[y].outerHTML.substring(3);
				}
				else
				{
					items[y].style.color="#DD3300";
					items[y].style.cursor="auto";
				}
				
			}
		}
		state++;
	}
	if(state > 4 && state < 45)
		state++;
	if(state == 45 || state == 21)
	{
		state++;
		window.scrollTo(0,document.body.scrollHeight);
	}
}
catch(e)
{
	badLoad = true;
}
}
SSLoader.prototype.setQNAME = function(qqnam)
{
	LNAME = qqnam;
}
SSLoader.prototype.load = function(url)
{
	sendLoadRequest(url);
}
function sendLoadRequest(LUrl)
{
	//console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>LOADING "+ LUrl);
	try
	{
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", LUrl, true);
	xmlHttp.send(null);
	}
	catch(e)
	{
	}
}
function XHRLoadFinished()
{
	return (xmlHttp.responseText!=null) && (xmlHttp.readyState == 4);
}
function getLoadText()
{
	return (xmlHttp.responseText).split('\n');
}
function RChandler(e)
{
	if(!e.ctrlKey)
	{
		document.getElementById("contextmenu").style.top = mouseY+"px";
		document.getElementById("contextmenu").style.left = mouseX+"px";
		document.getElementById("contextmenu").style.display = "block";
	}
	else
		document.getElementById("contextmenu").style.display = "none";
	return e.ctrlKey;
}
function MChandler()
{
	document.getElementById("contextmenu").style.display = "none";
}
function closeModalWindow()
{
	document.getElementById("overlay").style.display = "none";
}
function showModalWindow(X,Y)
{
	//console.log(X+","+Y);
	document.getElementById("modalcontent").innerHTML = teamStack[5][X][Y];
	document.getElementById("modaltitletext").innerHTML = teamStack[6][X][Y];
	document.getElementById("overlay").style.display = "block";
}
function setModalWindow(title,content)
{
	document.getElementById("modalcontent").innerHTML = content;
	document.getElementById("modaltitletext").innerHTML = title;
	document.getElementById("overlay").style.display = "block";
}
var whitelist = [
"fb-root",
"facebook-jssdk",
"overlay",
"modal",
"modalTitlebar",
"modaltitletext",
"modalcontent",
"topSpacer",
"teamName",
"main",
"crossCountry",
"football",
"volleyball",
"basketball",
"track",
"contextmenu",
"loginStyle"];
var MWC_MWfound = false;
function checkForMalware()
{
	if(MWC_MWfound)
		return;
	var allElements = document.getElementsByTagName("*");
	var allIds = [];
	var malIds = [];
	for (var i = 0, n = allElements.length; i < n; ++i) 
	{
		var el = allElements[i];
		if (el.id) { allIds.push(el.id); }
	}
	for(var x = 0; x < allIds.length; x++)
	{
		if(!whitelisted(allIds[x]))
		{
			console.log("UNREGISTERED ID: "+allIds[x]);
			if(allIds[x].indexOf("facebook") == -1 && allIds[x].indexOf("fb") == -1)
			{
				MWC_MWfound = true;
				console.log("THE ABOVE IS PROBABLY ADWARE");
				malIds.push(allIds[x]);
			}
			if(malIds.length > 0)
			setModalWindow("Thor Lancaster: You may have adware on your computer", "<br/><br/>A script on this page has detected foreign element(s) with ID(s) of:<br/><strong>"+malIds.toString().substring(0,500)+"</strong><br/><br/>If you see advertisements on this page, you almost certainly have adware. Adware can cause various problems such as excessive advertisements, computer slowdown, and even identity theft.<br/><br/>I can fix your computer for $20 to $40, depending on the severity of the infection. I have never failed to remove adware from any computer. I can come over to fix your computer on Saturdays (Basketball schedule permitting), Sundays, and days that are off of school.<br/><strong><i>Ways to contact me:</i></strong><ul><li style='display: block;'>1. <a href=https://www.facebook.com/thor.lancaster1>Contact Thor Lancaster on Facebook (log in first) </a></li><li style='display: block;'>2. E-mail: thorlancaster328@gmail.com</li><li style='display: block;'>3. Call 406-789-2446</li></ul><br/><br/>If you do not have adware, you can contact me and I will fix the issue.");
		}
	}
}
function whitelisted(item)
{
	for(var x = 0; x < whitelist.length; x++)
	{
		if(item == whitelist[x])
			return true;
	}
	return false;
}