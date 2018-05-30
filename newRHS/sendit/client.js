
var imageSource="live.php"; // name of picture to load
var updateDuration = 5000; // milliseconds between updates of picture
var ctlUpdateDuration = 50; // milliseconds between status bar redraws
var maxUnchangedSecs = 16; // seconds to stop refreshing
var maxStreamOfflineTime = 60; // seconds to declare stream offline

var nextUpdateTime = 0;
var lastCheckTime = -1;

var picCanvas; // canvas to draw picture on
var picContext;
var ctlCanvas; // canvas to draw controls on
var ctlContext;
var loaderImg;


function init(){
	picCanvas = DGE("picCanvas");
	ctlCanvas = DGE("ctlCanvas");
	loaderImg = DGE("loaderImage");
	picContext = picCanvas.getContext("2d");
	ctlContext = ctlCanvas.getContext("2d");
	setInterval(function(){updateCTL(); checkPic()}, ctlUpdateDuration);
	loaderImg.addEventListener("load", function(){updatePic()});
	handleResize();
}

function handleResize(){
	picCanvas.width = picCanvas.scrollWidth;
	picCanvas.height = picCanvas.scrollHeight;
	
	ctlCanvas.width = ctlCanvas.scrollWidth;
	ctlCanvas.height = ctlCanvas.scrollHeight;
	updateCTL();
	updatePic();
}
function updateCTL(){
	var ctx = ctlContext;
	var width = ctlCanvas.width;
	var height = ctlCanvas.height;
	var msUntilUpdate = Math.max(0,nextUpdateTime-performance.now());
	var statusMessage = "LIVE";
	if(lastCheckTime == -1)
		statusMessage = "Loading...";
	else if(!streamIsAlive())
	{
		if(lastCheckTime < maxStreamOfflineTime)
			statusMessage = "Refreshing picture when new one becomes available";
		else
			statusMessage = "Stream not currently running. Please check back later.";
		
	}
	
	ctx.clearRect(0, 0, width, height);
	ctx.filStyle = "rgba(0,32,64,0.4)";
	ctx.fillStyle = "#F00";
	ctx.strokeStyle = "#000";
	ctx.lineWidth=2;
	ctx.font = "1.5em sans-serif";
	
	ctx.strokeText(statusMessage,10,em2px(1.5));
	ctx.fillText(statusMessage,10,em2px(1.5));
}

function updatePic(){
	var ctx = picContext;
	var width = picCanvas.width;
	var height = picCanvas.height;
	var imgWidth = loaderImg.width;
	var imgHeight = loaderImg.height;
	ctx.clearRect(0, 0, width, height);
	if(imgWidth == 0 || imgHeight == 0){
		ctx.textAlign = "center";
		ctx.font = "3em sans-serif";
		ctx.strokeStyle = "#F70";
		ctx.lineWidth=1;
		ctx.fillStyle = "#000";
		var str = "Please Wait...";
		ctx.fillText(str, width/2, height/2);
		ctx.strokeText(str, width/2, height/2);
		return;
	}
	var winAspect = width/height;
	var imgAspect = imgWidth/imgHeight;
	var drawX = 0;
	var drawY = 0;
	var drawW = width;
	var drawH = height;
	if(winAspect < imgAspect){
		drawH = height*(winAspect/imgAspect);
		drawY = (height-drawH)/2;
	}
	if(winAspect > imgAspect){
		drawW = width*(imgAspect/winAspect);
		drawX = (width-drawW)/2;
	}
	ctx.drawImage(loaderImg, drawX, drawY, drawW, drawH);
}

function loadNewPic(){
	loaderImg.src = "live.jpg?d="+new date();
}


function checkPic(){
	var time = performance.now();
	if(time >= nextUpdateTime){
		nextUpdateTime = time+updateDuration;
		beginUpdate();
	}
}

function beginUpdate(){
	if(streamIsAlive())
		loaderImg.src=imageSource+"?d="+new Date().getTime();
	var xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function(){
		lastCheckTime = parseInt(this.responseText);
	});
	xhr.open("GET", "check.php");
	xhr.send();
}

function streamIsAlive(){
	return lastCheckTime <= maxUnchangedSecs;
}


function em2px(em){
	return em*16;
}
function DGE(str){
	return document.getElementById(str);
}