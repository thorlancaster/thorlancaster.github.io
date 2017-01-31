var serverURL = "http://70.33.46.149";
function scoreboard()
{
	setInterval(function(){ loadScores() }, 1000);
}
function loadScores()
{
	RCload(serverURL);
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
	var content = this.responseText;
	var args = content.split(";");
	for(var x = 0; x < args.length; x++)
		args[x] = args[x].split(",");
	console.log(args);
	
	document.getElementById("homename").innerHTML = args[0][0];
	document.getElementById("guestname").innerHTML = args[0][1];
	
	var temp = args[1][1];
	if(temp.length == 1)
		temp = "0"+temp;
	document.getElementById("clock").innerHTML = args[1][0] + ":"+ temp;
	
	document.getElementById("homescore").innerHTML = args[2][0];
	document.getElementById("guestscore").innerHTML = args[2][1];
	
	document.getElementById("period").innerHTML = "period<br/>"+args[3][0];
	
	document.getElementById("homefoul").innerHTML = "<div class='description'>Fouls</div>"+args[4][0];
	document.getElementById("guestfoul").innerHTML = "<div class='description'>Fouls</div>"+args[4][1];
	
}