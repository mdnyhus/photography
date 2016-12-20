var vieweingImage = false;
var pictureJSON;
var numImages;
var imgs = [];
var movingImgWrapper;
var numSlides = 4; // Should be even
var slideVars = [];
var slideSpanVars = [];
var movingSlidesWrapper;
var upArrow;
var downArrow;
var gradientCoverLeft;
var gradientCoverRight;
var selectedSlide = 0;
var offset;
var setIntervalImgSlides = false;
var descriptionEl;
var process = true;
var cover;
var fadeCoverEl;
var setIntervalSlider = false;
var sliderOffset;
var fadeOpacity;
var imgSuperContainer;
var textSuperContainer;
var revealContainer;
var tightImgContainer;
var originalImg;
var originalImgCover;
var finalImg;
var finalImgCover;
var revealSliderContainer;
var imageSliderRange;
var horz = true;
var revealSliderValue = 50;
var setIntervalRevealSlider = false;
var revealSliderOffset;
var revealCover;

window.onload = function() {
	loadImageViewer();
};

window.onresize = function() {
	dynamicSizing();
}

function loadImageViewer() {
	var selectedImg = 0;
	var url = window.location.href;
	var params = url.split('?');
	if (params.length > 0) {
		selectedImg = parseInt(params[1]);
	}
	
	pictureJSON = picturesJSON.pictures[selectedImg];
	document.title = pictureJSON.name;
	document.getElementById("favicon").href = getImgFromName(pictureJSON.stages[pictureJSON.stages.length - 1].name);
	
	numImages = pictureJSON.stages.length;
	initializeVariables();
	initializeText();
	initializeImgs();
	initializeSlides();
	initializeReveal();
	dynamicSizing();
	updateSlider(50);
	
	updateSelectedSlide(0);
}

function initializeVariables() {
	cover = document.getElementById("cover");
	revealCover = document.getElementById("revealCover");
	fadeCoverEl = document.getElementById("fadeCover");
	sliderOffset = 0;
	revealSliderOffset = 0;
	fadeOpacity = 0;
	
	imgSuperContainer = document.getElementById("imgSuperContainer");
	textSuperContainer = document.getElementById("textSuperContainer");
	revealContainer = document.getElementById("revealContainer");
	revealSliderContainer = document.getElementById("revealSliderContainer");
}

function getImgFromName(name) {
	imgSrcPrefix = "./" + pictureJSON.folder + "/";
	return imgSrcPrefix + name;
}

function initializeText() {
	document.getElementById("titleSpan").innerHTML = pictureJSON.name;
	descriptionEl = document.getElementById("descriptionSpan");
}

function initializeImgs() {
	imgsDom = [];
	for (i = 0; i < numImages; i++) {
		iStr = i.toString();
		imgsDom.push(
			"<div id=\"img", iStr, "Container\" class=\"imgContainer\">",
			"<img id=\"img", iStr, "\">",
			"</div>"
		);
	}
	
	movingImgWrapper = document.getElementById("movingImgWrapper");
	movingImgWrapper.innerHTML = imgsDom.join("");
	movingImgWrapper.style.width = "calc(" + numImages + "*(33vw + 4vw)";
	
	for (i = 0; i < numImages; i++) {
		iStr = i.toString();
		imgs[i] = document.getElementById("img" + iStr);
		imgs[i].src = getImgFromName(pictureJSON.stages[i].name);
	}
}

function initializeSlides() {
	// There's probably a better way of injecting dynamic HTML
	slides = [];
	for (i = 0; i < numImages; i++) {
		iStr = i.toString();
		slides.push(
			"<div id=\"slide", iStr, "\" class=\"slide\">",
			"<span id=\"slide", iStr, "Span\" class=\"slideSpan\">",
			pictureJSON.stages[i].title,
			"</span>",
			"</div>"
		);
	}
	movingSlidesWrapper = document.getElementById("movingSlidesWrapper1");
	movingSlidesWrapper.innerHTML = slides.join("");
	movingSlidesWrapper.style.width = "calc(" + numImages + "*(10vw + 4vw))";
	
	for (i = 0; i < numImages; i++) {
		iStr = i.toString();
		slideVars[i] = document.getElementById("slide" + iStr);
		slideSpanVars[i] = document.getElementById("slide" + iStr + "Span");
	}
	
	upArrow = document.getElementById("upArrowImg1");
	downArrow = document.getElementById("downArrowImg1");
	gradientCoverLeft = document.getElementById("gradientCoverLeft");
	gradientCoverRight = document.getElementById("gradientCoverRight");
}

function updateSelectedSlide(selectedIndex) {
	animateScroll(selectedIndex);
	
	if (selectedIndex == 0) {
		upArrow.style.opacity = 0.2;
		upArrow.style.cursor = "auto";
		gradientCoverLeft.style.cursor = "auto";
	} else {
		upArrow.style.opacity = 1;
		upArrow.style.cursor = "pointer";
		gradientCoverLeft.style.cursor = "pointer";
	}
	if (selectedIndex >= numImages - 2) {
		downArrow.style.opacity = 0.2;
		downArrow.style.cursor = "auto";
		gradientCoverRight.style.cursor = "auto";
	} else {
		downArrow.style.opacity = 1;
		downArrow.style.cursor = "pointer";
		gradientCoverRight.style.cursor = "pointer";
	}
	
	if (selectedSlide !== undefined) {
		oldSelectedSlide = selectedSlide;
		if (oldSelectedSlide >= 0 && oldSelectedSlide < numImages) {
			slideVars[oldSelectedSlide].style.padding = "2px";
			slideVars[oldSelectedSlide].style.borderWidth = "1px";
			slideVars[oldSelectedSlide + 1].style.padding = "2px";
			slideVars[oldSelectedSlide + 1].style.borderWidth = "1px";
		}
	}
	selectedSlide = selectedIndex;
	if (selectedIndex >= 0 && selectedIndex < numImages) {
		slideVars[selectedIndex].style.padding = "1px";
		slideVars[selectedIndex].style.borderWidth = "2px";
		slideVars[selectedIndex + 1].style.padding = "1px";
		slideVars[selectedIndex + 1].style.borderWidth = "2px";
	}
	
	// update description
	descriptionEl.innerHTML = pictureJSON.stages[selectedSlide+1].description;
}

function animateScroll(selectedIndex) {
	var target = -1 * selectedIndex;
	var oldOffset = -1 * selectedSlide;
	var increment = 0.025;
	if (target < oldOffset) {
		increment = -0.025;
	}
	offset = oldOffset;
	changeTransform(movingSlidesWrapper, "translateX(calc(" + oldOffset + " *(10vw + 4vw)))");
	changeTransform(movingImgWrapper, "translateX(calc(" + oldOffset + " *(33vw + 4vw)))");
	
	if (setIntervalImgSlides != false) {
		// impatient clicks; just move instantly
		changeTransform(movingSlidesWrapper, "translateX(calc(" + target + " *(10vw + 4vw)))");
		changeTransform(movingImgWrapper, "translateX(calc(" + target + " *(33vw + 4vw)))");
		clearInterval(setIntervalImgSlides);
		setIntervalImgSlides = false;
	} else {
		setIntervalImgSlides = setInterval(frame, 2, target, increment);
		function frame(target, increment) {
			// avoid floating point error
			offsetCompare = Math.round(offset*1000);
			if (offsetCompare == target*1000) {
				clearInterval(setIntervalImgSlides);
				setIntervalImgSlides = false;
			} else {
				offset += increment; 
				changeTransform(movingSlidesWrapper, "translateX(calc(" + offset + " *(10vw + 4vw)))");
				changeTransform(movingImgWrapper, "translateX(calc(" + offset + " *(33vw + 4vw)))");
			}
		}
	}
}

function upArrowClicked() {
	if (selectedSlide != 0) {
		updateSelectedSlide(selectedSlide - 1);
	}
}

function downArrowClicked() {
	if (selectedSlide < numImages - 2) {
		updateSelectedSlide(selectedSlide + 1);
	}
}

function initializeReveal() {
	tightImgContainer = document.getElementById("tightImgContainer");
	originalImg = document.getElementById("originalImg");
	originalImg.src = getImgFromName(pictureJSON.stages[0].name);	
	originalImgCover = document.getElementById("originalImgCover");
	finalImg = document.getElementById("finalImg");
	finalImg.src = getImgFromName(pictureJSON.stages[numImages - 1].name);
	finalImgCover = document.getElementById("finalImgCover");
	imageSliderRange = document.getElementById("imageSliderRange");
}

function slideClick() {
	process = !process;
	var increment = -0.1;
	var target = -5;
	if (process) {
		increment = 0.1;
		target= 0;
	}
	var fadeIncrement = increment / (target - sliderOffset);
	fadeIn = true;
	
	if (setIntervalSlider != false) {
		// impatient clicks; just move instantly
		changeTransform(cover, "translateX(" + target + "vw)");
		sliderOffset = target;
		if (process) {
			revealContainer.style.visibility = "hidden";
			revealSliderContainer.style.visibility = "hidden";
			imgSuperContainer.style.visibility = "visible";
			textSuperContainer.style.visibility = "visible";
		} else {
			imgSuperContainer.style.visibility = "hidden";
			textSuperContainer.style.visibility = "hidden";
			revealContainer.style.visibility = "visible";
			revealSliderContainer.style.visibility = "visible";
		}		
		fadeCoverEl.style.opacity = 0;
		clearInterval(setIntervalSlider);
		setIntervalSlider = false;
	} else {	
		fadeCoverEl.style.opacity = 1;
		setIntervalSlider = setInterval(moveSlider, 2, target, increment, fadeIncrement);
		function moveSlider(target, increment, fadeIncrement) {
			// avoid floating point error
			testOffset = Math.round(sliderOffset*1000);
			if (testOffset == target*1000) {
				fadeCoverEl.style.opacity = 0;
				// slider is finished and fadeCover is half done
				fadeIn = false;
				if (process) {
					revealContainer.style.visibility = "hidden";
					revealSliderContainer.style.visibility = "hidden";
					imgSuperContainer.style.visibility = "visible";
					textSuperContainer.style.visibility = "visible";
				} else {
					imgSuperContainer.style.visibility = "hidden";
					textSuperContainer.style.visibility = "hidden";
					revealContainer.style.visibility = "visible";
					revealSliderContainer.style.visibility = "visible";
				}
				clearInterval(setIntervalSlider);
				setIntervalSlider = false;
			} else {
				sliderOffset += increment; 
				changeTransform(cover, "translateX(" + sliderOffset + "vw)");
			}
		}
	}
}

function revealSlideClick() {
	horz = !horz;
	var increment = -0.1;
	var target = -5;
	if (horz) {
		increment = 0.1;
		target= 0;
	}
	
	if (setIntervalRevealSlider != false) {
		// impatient clicks; just move instantly
		changeTransform(revealCover, "translateX(" + target + "vw)");
		revealSliderOffset = target;
		flipRevealSlider();
		clearInterval(setIntervalRevealSlider);
		setIntervalRevealSlider = false;
	} else {	
		setIntervalRevealSlider = setInterval(moveRevealslider, 2, target, increment);
		function moveRevealslider(target, increment) {
			// avoid floating point error
			testOffset = Math.round(revealSliderOffset*1000);
			if (testOffset == target*1000) {
				fadeCoverEl.style.opacity = 0;
				fadeOpacity = 0;
				flipRevealSlider();
				clearInterval(setIntervalRevealSlider);
				setIntervalRevealSlider = false;
			} else {
				revealSliderOffset += increment; 
				changeTransform(revealCover, "translateX(" + revealSliderOffset + "vw)");
			}
		}
	}
}

function flipRevealSlider() {
	if (horz) {
		changeTransform(imageSliderRange, "rotate(0deg)");
		imageSliderRange.style.cursor = "col-resize";
		originalImgCover.style.width = revealSliderValue + "%";
		originalImgCover.style.height = "100%";
		finalImgCover.style.width = (100 - revealSliderValue) + "%";
		finalImgCover.style.height = "100%";		
		changeTransform(finalImg, "translateX(-" + revealSliderValue + "%)");
	} else {
		changeTransform(imageSliderRange, "rotate(90deg)");
		imageSliderRange.style.cursor = "row-resize";
		originalImgCover.style.width = "100%";
		originalImgCover.style.height = revealSliderValue + "%";
		finalImgCover.style.width = "100%";
		finalImgCover.style.height = (100 - revealSliderValue) + "%";
		changeTransform(finalImg, "translateY(-" + revealSliderValue + "%)");
	}
}

function updateSlider(newValue) {
	if (horz) {
		originalImgCover.style.width = newValue + "%";
		finalImgCover.style.width = (100 - newValue) + "%";
		changeTransform(finalImg, "translateX(-" + newValue + "%)");
	} else {
		originalImgCover.style.height = newValue + "%";
		finalImgCover.style.height = (100 - newValue) + "%";
		changeTransform(finalImg, "translateY(-" + newValue + "%)");
	}
	revealSliderValue = newValue;
}

function changeTransform(el, transformStr) {
	el.style.transform = transformStr;
	el.style.webkitTransform = transformStr;
	el.style.MozTransform = transformStr;
	el.style.msTransform = transformStr;
	el.style.OPTransform = transformStr;
}

function dynamicSizing() {
	maxWidth = revealContainer.clientWidth;
	maxHeight = revealContainer.clientHeight;
	width = Math.min(maxWidth, maxHeight);
	
	tightImgContainer.style.width = width + "px";
	tightImgContainer.style.padding = "0 calc((70vw - " + width + "px)/2)";
	tightImgContainer.style.paddingBottom = "calc((100vh - 9vw - 9vw - " + width + "px))";
	tightImgContainer.style.width = width + "px";
	tightImgContainer.style.height = width + "px";
}