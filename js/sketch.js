var capture;
var cap_size = 480;
var text_size = 100;
var width_margin;
var height_margin;
var dimension = 3; //check that this is never less than 2
var pad = 16;

var tappedScreen = false;

var screenshot;
var button;
var filters = ['THRESHOLD', 'INVERT', 'GRAY'];

var cam_constraints = {
	video: {
		facingMode: { exact: "environment"},
		frameRate: 30
	},
	audio: false
};

var digits_only = {
    lang: 'eng',
    tessedit_char_whitelist: '0123456789',
    //classify_bln_numeric_mode: 1 // EDGE: decimals
}

var testM = [
    [1,2,4],
    [1,32,2],
    [1,0,11]
];

var m_buffer = [];


function setup() {
    'use strict';
	pixelDensity(1);
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, TOP);
	
    capture = createCapture(cam_constraints);
  	capture.hide();
	
	// "SOLVE" button
	let myString = "solve";
	button = createButton(myString);
	button.size(width - 32, 100);
  	button.position(width/2 - button.width/2, height - button.height - 10);
  	button.mouseClicked(solveMyMatrix);
	
	width_margin = (width - cap_size) / 2;
	height_margin = (height - cap_size) / 2;
}


function draw() {
    // Draw the live-camera if we haven't captured anything
	if(!tappedScreen){ // This is a bad name
		background(255,0,0);
		image(capture, 0, 0, width, width * capture.height / capture.width);
		drawCaptureRetical();
	}
}




// When called, cuts the image within the cap_size area
// This is where the magic happens
// Definitely should be renamed
//
function solveMyMatrix()
{
	tappedScreen = !tappedScreen; // Janky toggle, sue me
	
	if(tappedScreen)
	{
		capture.pause();

        /*
            This part is a little janky
            In effect we're:
            - Screenshotting
            - Grabbing the matrix sub-section
            - Greyscaling the cropped screenshot
            - Passing that crop to the TesseractJob
        */

		image(capture, 0, 0, width, width * capture.height / capture.width);
		screenshot = get(width_margin,height_margin, cap_size,cap_size);
		screenshot.filter(GRAY);
		image(screenshot,width_margin,height_margin);
		//drawCaptureRetical();


        // --- IMAGE DETECTION ---

        Tesseract.recognize(screenshot.canvas, digits_only)
        .progress(message => console.log(message))
        .catch(function (e) {
            console.log(e);
            return;
        })
        .then(function (result) {

            // Parse the result, worst case, a zero-matrix is returned
            var matrix = parseTessJob(result, dimension, screenshot.canvas);
            console.log(matrix);


            // rref()
            // rrefParse()


            // Draw result to screen
            drawNums(matrix);
        });


	}else{
		capture.play();	
	}
	
	return false;
}




// --- DRAWING ---


// Displays a dimension x dimension
// matrix over the grid
// Nothing more nothing less
function drawNums(nums)
{
	textSize(text_size);
	fill(0);
    noStroke();

	for(let i = 0; i < dimension; i++)
	{
		for(let j = 0; j < dimension; j++)
		{
            // nums is organized nums[row][col], so i & j must be swapped
			text(nums[i][j], width_margin + (cap_size/3 * j) + text_size/2, height_margin + (cap_size/3 * i));
		}
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
