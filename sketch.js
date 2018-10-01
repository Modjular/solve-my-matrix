var capture;
var cap_size = 320;
var width_margin;
var height_margin;
var dimension = 3; //check that this is never less than 2
var pad = 16;
var pd;
var capg;
var screenshot;

var tappedScreen = false;

var button;

var constraints = {
	video: {
		facingMode: { exact: "environment"},
		frameRate: 30
	},
	audio: false,
}


function setup() {
  	createCanvas(windowWidth, windowHeight);
	pd = pixelDensity();
	
  	capture = createCapture(constraints);
  	capture.hide();
	capg = createGraphics(capture.width, capture.height);
	capg.noFill();
	
	// solve button
	let myString = "PIXELDENSItY: " + pd";
	button = createButton(myString);
	button.size(width - 32, 100);
  	button.position(width/2 - button.width/2, height - button.height - 10);
  	button.mouseClicked(cropImage);
	
	width_margin = (width - cap_size) / 2;
	height_margin = (height - cap_size) / 2;
}


function draw() {
	if(!tappedScreen){
		background(255,0,0);
		image(capture, 0, 0, width, width * capture.height / capture.width);
		drawCaptureRetical();
	}
}

//
// Just for the UI, probably should be put elsewhere
//
function drawCaptureRetical()
{
	stroke(255);
	strokeWeight(8);
	noFill();
	
	rect(width_margin,height_margin, width-width_margin*2, height-height_margin*2);
	
	strokeWeight(4);
	let spacing = cap_size / dimension;
	
	for(let i = 1; i <= dimension; i++)
	{
		line( width_margin+spacing*i, height_margin + pad,
		      width_margin+spacing*i, height_margin+cap_size - pad);
		
		line( width_margin + pad,          height_margin+spacing*i,
		      width_margin+cap_size - pad, height_margin+spacing*i);
	}
}


// When called, cuts the image within the cap_size area
function cropImage()
{
	tappedScreen = !tappedScreen;
	
	if(tappedScreen)
	{
		capture.pause();

		image(capture, 0, 0, width, width * capture.height / capture.width);
		screenshot = get(width_margin,height_margin, cap_size,cap_size);
		screenshot.filter(GRAY);
		image(screenshot,width_margin,height_margin);
		//drawCaptureRetical();
	}else{
		capture.play();	
	}
	
	return false;
}
