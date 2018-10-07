var capture;
var cap_size = 480;
var width_margin;
var height_margin;
var dimension = 3; //check that this is never less than 2
var pad = 16;

var tappedScreen = false;

var screenshot;
var button;
var filters = ['THRESHOLD', 'INVERT', 'GRAY'];

var constraints = {
	video: {
		facingMode: { exact: "environment"},
		frameRate: 30
	},
	audio: false
};
var parameters = {
    //tessedit_char_whitelist: '0123456789.'
    classify_bln_numeric_mode: 1 // EDGE: decimals
}


function setup() {
    'use strict';
	pixelDensity(1);
    createCanvas(windowWidth, windowHeight);
	
    capture = createCapture(constraints);
  	capture.hide();
	
	// solve button
	let myString = "solve";
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
		//screenshot.filter(INVERT);
		image(screenshot,width_margin,height_margin);
		//drawCaptureRetical();

        // --- IMAGE DETECTION ---
        // Inline seems like less of a hassle
        // TRY{}
        Tesseract.recognize(screenshot.canvas, parameters)
        .catch(function (e) {
            console.log(e);
            return;
        })
        .progress(function(msg){
            console.log("progress: ", msg.recognize);
        })
        .then(function (result) {
            var matrix = parseTessJob(result, dimension);
            console.log(matrix);
        });


	}else{
		capture.play();	
	}
	
	return false;
}
