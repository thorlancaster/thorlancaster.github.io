var mouseX = 0;
var mouseY = 0;
document.onmousemove = function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
}
function selectPicture()
{
	if(document.elementFromPoint(mouseX, mouseY).nodeName == "IMG")
	{
		document.getElementById("fimg").src = document.elementFromPoint(mouseX, mouseY).src;
		document.getElementById("fullimage").style.visibility = "visible";
	}
}
function hideImage()
{
  setTimeout(function(){document.getElementById("fullimage").style.visibility = "hidden";},10);
}
