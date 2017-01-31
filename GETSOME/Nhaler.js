var PASSWORD;
function Nhale()
{
	var password = prompt("Enter password","");
	PASSWORD = password;
	password = Sha1.hash(password, "");
	if(password == "8315010df9110d9f311fbaaa861df3c199a44b4c")
	{
		document.getElementById("Ncanvas").setAttribute("data-processing-sources","Nplayer.pde.locked");
		setTimeout(nebulize,500);
	}
	else
	{
		window.location.href="badpw.html";
	}
}
function nebulize()
{
	document.getElementById("PJS").setAttribute("src","processing.js");
}