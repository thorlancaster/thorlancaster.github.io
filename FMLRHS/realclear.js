var ctx;
var RCcanvas;
var RCimageData;
var RCresized = false;
var RCHdata = new Array();
var RCGdata = new Array();
var RCnew = new Array();
var RCdataMax = 50;
var RCwidth = 0;
var RCheight = 0;
var RCpixels = new Array();
var mouseX;
var mouseY;
var lastClicked = 0;
var RCHcolor = 0xFF0000FF;
var RCGcolor = 0x0066FFFF;
var RCNScolor = 0xFFDD79FF;
var RCisLive = false;
var RCGDI = "";
var fontSize = 12;
var maxDataVal = 0;
document.onmousemove = function(e){
	lastClicked = 0;
	mouseX = e.pageX;
	mouseY = e.pageY;
	if(mouseX < 0)
	{
		mouseX = 0;
		//clearMouse();
	}
	if(mouseX >= window.innerWidth)
	{
		mouseX = window.innerWidth-1;
		//clearMouse();
	}
	if(mouseX > 100)
		document.getElementById("RCmouse").style.left = mouseX-100+"px";
	else
		document.getElementById("RCmouse").style.left = mouseX + "px";
	document.getElementById("RCmouse").style.top = mouseY + "px";
	
	document.getElementById("RCMline").style.left = mouseX + "px";
	document.getElementById("RCMshade").style.top = mouseX + "px";
	document.getElementById("RCmouse").innerHTML = "Redhawks: "+getHDataValue(mouseX)+"<br/>Guest: "+getGDataValue(mouseX);
	document.getElementById("RCmouse").style.opacity = "0.6";
}
var date;
function getHDataValue(mousePos)
{
	if(((mousePos/Xstretch+0.5)|0) >= RCHdata.length-1)
	{
		RCisLive = true;
		return RCHdata[RCHdata.length-1];
	}
	RCisLive = false;
	return RCHdata[(mousePos/Xstretch+0.5)|0];
}
function getGDataValue(mousePos)
{
	if(((mousePos/Xstretch+0.5)|0) >= RCGdata.length-1)
	{
		RCisLive = true;
		return RCGdata[RCGdata.length-1];
	}
	RCisLive = false;
	return RCGdata[(mousePos/Xstretch+0.5)|0];
}
function RCinit()
{
	RCcanvas = document.getElementById("RCcanvas");
	ctx = RCcanvas.getContext("2d");
	RCHdata.push(10);
	RCGdata.push(10);
	RCresize();
	window.setInterval(function(){RCloop()},34); // 30 FPS, 34
	RCresized = true;
	fontSize = parseFloat(window.getComputedStyle(document.getElementById("RCfontSize")).fontSize);
	date = new Date();
	RCload("data:text/plain;base64,JVJDVjowLDA6MCwxOjAsMjowLDM6MCw0OjEsNDoyLDQ6Myw0OjQsNDxOUz46MCwwOjEwLDEwOjIwLDIwPE5TPjowLDA6MSwwOjIsMDoyLDA6MiwwOjIsMDoyLDA=");
}
var RCloadRequest;
function RCload(URL)
{
	RCloadRequest = new XMLHttpRequest();
	RCloadRequest.addEventListener("load", RCloadCallback);
	RCloadRequest.open("GET", URL);
	RCloadRequest.send();
}
function RCloadCallback()
{
	if(window.frameElement.getAttribute('data-realclear-sources'))
	{
		RCGDI = window.frameElement.getAttribute('data-realclear-sources');
	}
	else
	{
		RCGDI = this.responseText;
	}
	var scores = (RCGDI.split(":"));
	RCHdata.length = 0;
	RCGdata.length = 0;
    maxDataVal = 0;
	for(var x = 0; x < scores.length; x++)
	{
		if(parseInt(scores[x].split(",")[0]) >= 0)
		{
			RCHdata.push(parseInt(scores[x].split(",")[0]));
			RCGdata.push(parseInt(scores[x].split(",")[1]));
			RCnew.push(false);
			if(scores[x].split(",")[1].indexOf("<NS>") > -1)
			{
				RCnew[RCnew.length-1] = true;
			}
			if(RCHdata[RCHdata.length-1] > maxDataVal)
				maxDataVal = RCHdata[RCHdata.length-1];
			if(RCGdata[RCGdata.length-1] > maxDataVal)
				maxDataVal = RCGdata[RCGdata.length-1];
		}
	}
	RCresized = true;
}
function RCresize()
{
	RCresized = true;
	document.getElementById("RCcanvas").style.height = window.innerHeight+"px";
	RCwidth = RCcanvas.clientWidth;
	RCheight = RCcanvas.clientHeight;
	ctx.canvas.width  = RCwidth;
	ctx.canvas.height = RCheight;
	RCimageData = ctx.createImageData(RCwidth, RCheight);
	RCpixels = new Array(RCimageData.data.length/4);
	for(var x = 0; x < RCpixels.length; x++)
	{
		RCpixels[x] = 0x000000FF;
	}
}
function RCloop()
{
	if(lastClicked < 32768)
	lastClicked++;
	if(lastClicked > 80 && lastClicked <= 130)
	{
		document.getElementById("RCmouse").style.opacity = ""+((140-lastClicked)/100);
	}
	if(RCresized)
	{
		RCresized = false;
		RCdataMax = maxDataVal*1.1;
		RCdataMax/=(RCheight/(RCheight+fontSize*3));
		RCupdate();
		var SC = 0;
		for(var x = 0; x < RCimageData.data.length; x+=4)
		{
			RCimageData.data[x] = ((RCpixels[SC]>>24)&0xFF);
			RCimageData.data[x+1] = ((RCpixels[SC]>>16)&0xFF);
			RCimageData.data[x+2] = ((RCpixels[SC]>>8)&0xFF);
			RCimageData.data[x+3] = ((RCpixels[SC])&0xFF);
			SC++;
		}
		ctx.putImageData(RCimageData,0,0);
		goLive();
	}
}

function RCupdate()
{
	background(0x000000FF);
	Xstretch = RCwidth/RCHdata.length;
	Ystretch = (RCheight/RCdataMax);
	STROKE = RCGcolor;
	for(var x = 0; x < RCGdata.length-1; x++)
	{
		line(x*Xstretch,RCheight-(RCGdata[x]*Ystretch), (x+1)*Xstretch, RCheight-(RCGdata[x+1]*Ystretch), false);
	}
	STROKE = RCHcolor;
	for(var x = 0; x < RCHdata.length-1; x++)
	{
		line(x*Xstretch,RCheight-(RCHdata[x]*Ystretch), (x+1)*Xstretch, RCheight-(RCHdata[x+1]*Ystretch), false);
	}
	for(var x = 0; x < RCGdata.length-1; x++)
	{
		STROKE = RCGcolor;
		line(x*Xstretch,RCheight-(RCGdata[x]*Ystretch), (x+1)*Xstretch, RCheight-(RCGdata[x+1]*Ystretch), true);
		if(RCnew[x])
		{
			STROKE = RCNScolor;
			line(x*Xstretch, RCheight, x*Xstretch, 0, true);
		}
	}
}
function line(x0, y0, x1, y1, dotted) {
	x0 = x0|0;
	x1 = x1|0;
	y0 = y0|0;
	y1 = y1|0;
	y1--;
	y0--;
	var toggle=false;

	if (Math.abs(x0 - x1) > Math.abs(y0 - y1)) {
		var Yerr = (y1 - y0) / (x1 - x0);
		if (x1 > x0)
			for (var x = x0; x < x1; x++) {

				y0 += Yerr;
				if(!dotted || toggle)
				RCpixels[x + (y0 | 0) * RCwidth] = STROKE;
				toggle=!toggle;
			}
		else {
			var temp = y1;
			y1 = y0;
			y0 = temp;
			for (var x = x1; x < x0; x++) {
				y0 += Yerr;
				if(!dotted || toggle)
				RCpixels[x + (y0 | 0) * RCwidth] = STROKE;
				toggle=!toggle;
			}
		}
	} else {
		var Xerr = (x1 - x0) / (y1 - y0);
		if (y1 > y0)
			for (var y = y0; y < y1; y++) {

				x0 += Xerr;
				if(!dotted || toggle)
				RCpixels[(x0 | 0) + y * RCwidth] = STROKE;
				toggle=!toggle;
			}
		else {
			var temp = x1;
			x1 = x0;
			x0 = temp;
			for (var y = y1; y < y0; y++) {
				x0 += Xerr;
				if(!dotted || toggle)
				RCpixels[(x0 | 0) + y * RCwidth] = STROKE;
				toggle=!toggle;
			}
		}
	}
}

function background(bgcolor){
	for(var x = 0; x < RCpixels.length; x++)
		RCpixels[x] = bgcolor;
}
function fullscreen(element) {
	if(!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement))
	{
		if(element.requestFullscreen) element.requestFullscreen();
		else if(element.mozRequestFullScreen) element.mozRequestFullScreen();
		else if(element.webkitRequestFullscreen) element.webkitRequestFullscreen();
		else if(element.msRequestFullscreen) element.msRequestFullscreen();
	}
	else
	{
	if(document.exitFullscreen)
		document.exitFullscreen();
	else if(document.mozCancelFullScreen)
		document.mozCancelFullScreen();
	else if(document.webkitExitFullscreen)
		document.webkitExitFullscreen();
	}
}
function clearMouse(){}
function goLive()
{
	var temp = window.innerWidth-3;
	document.getElementById("HRCdetails").innerHTML = (getHDataValue(temp));
	document.getElementById("GRCdetails").innerHTML = (getGDataValue(temp));
	RCisLive = true;
}

















