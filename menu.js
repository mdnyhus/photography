var menuSuperContainer;
var infoContainer;
var imgEls = [];
var fadeEls = [];
var textEls = [];

var covers = [];

window.onload = function() {
	loadMenu();
};

// Menu functions
function loadMenu() {
	menuSuperContainer = document.getElementById("menuSuperContainer");
	infoContainer = document.getElementById("infoContainer");
	
	loadImages();
}

function loadImages() {
	numPictures = picturesJSON.pictures.length;
	pictures = [];
	for (i = 0; i < numPictures; i++) {
		iStr = i.toString();
		
		className = "menuImgContainer";
		if (i%2 == 0) {
			className += " menuLeftImg";
		}
		
		pictures.push(
			"<div id=\"menuImg", iStr, "Container\" class=\"", className, "\" ",
			"onmouseover=\"hoverOn(", i, ")\" ",
			"onmouseout=\"hoverOut(", i, ")\">",
			
			"<div id=\"foregroundImg", i, "\" class=\"foregroundImg\">",
			"<div id=\"fadeCoverBlack", i, "\" class=\"fadeCoverBlack\"></div>",
			"<div id=\"textCover", i, "\" class=\"textCover\">",
			"<span id=\"textSpan\"", i, "\" class=\"textSpan\">",
			picturesJSON.pictures[i].name,
			"</span>",
			"</div>",
			"<a href=\"pictures/viewer.html?", i, "\">",
			"<img id=\"oldMenuImg", iStr, "\" src=\"", getImgSrc(i, true),	"\">",
			"</a>",
			"</div>",
			
			"<div id=\"backgroundImg", i, "\" class=\"backgroundImg\">",
			"<a href=\"pictures/viewer.html?", i, "\">",
			"<img id=\"menuImg", iStr, "\" src=\"", getImgSrc(i, false),	"\">",
			"</a>",
			"</div>",
			"</div>"
		);
	}
	
	menuSuperContainer.innerHTML = pictures.join("");
	
	for (i = 0; i < numPictures; i++) {		
		covers[i] = document.getElementById("foregroundImg" + i);
	}
}

function getImgSrc(index, first) {
	pictureIndex = 0;
	if (!first) {
		pictureIndex = picturesJSON.pictures[index].stages.length - 1;
	}
	imgFolder = picturesJSON.pictures[index].folder;
	imgName = picturesJSON.pictures[index].stages[pictureIndex].name;
	return "./pictures/" + imgFolder + "/" + imgName;
}

function hoverOn(index) {
	covers[index].style.visibility = "visible";
}

function hoverOut(index) {
	covers[index].style.visibility = "hidden";
}

function infoClick() {
	infoContainer.style.visibility = "visible";
}

function hideInfo() {
	infoContainer.style.visibility = "hidden";
}