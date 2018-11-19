//
// Takes a TesseractJob, attempts to parse it into a matrix.
//
function parseTessJob(job, dim, img) {

    var confidence_threshold = 55; // I know I have really low standards

    var w = img.width; // img width
    var h = img.height; // img height

    var m = dim;
    var n = dim;
    var cell_w = w/m;
    var cell_h = h/n;
    var symbols = getSymbols(result);
    var t_m = validateSymbols(m,n,cell_w, cell_h, symbols);

    return t_m
}



// Scrapes an img, checking each cell in the m by n grid
// m,n - dimensions of the matrix
// w,h - dimensions of the individual cells
// symbols - list of symbols to assess
// return an m by n matrix
function validateSymbols(m,n,w,h,symbols){

    var result = []

    for (i = 0; i < n; i++) {
        result[i] = [];
        for(let j = 0; j < m; j++){
            result[i][j] = 0;
        }
    }

    for(let i = 0; i < m; i++){
        for(let j = 0; j < n; j++){

            let x = i * w;
            let y = j * h;
            let si = indexOfClosestSymbol(x,y,w,h,symbols);

            console.log(si);

            // -1 = no valid symbol
            if(si > -1){
                result[j][i] = parseFloat(symbols[si].text);
                symbols.splice(si,1); // remove si from candidates
            }
        }
    }

    return result;
}



// Given a rectangle defined by x,y, and a width and height,
// returns the first, valid symbol index (if possible)
// If no valid symbol, return -1
function indexOfClosestSymbol(x,y,w,h, symbols){

    // An idea is to have a metric that measures how much
    // "surface area" is "ontop" of the target
    // But how would that get measured?
    // Surface-Area-Index > Target-Surface-Threshold
    // If there is more than one symbol?
    // Deal with that later

    // NAIVE IMPLEMENTATION
    for(let i = 0; i < symbols.length; i++){

        let s = symbols[i];

        if(s.bbox.x0 > x && s.bbox.y0 > y && s.bbox.x1 < x+w && s.bbox.y1 < y+h){
            return i;
        }
    }

    //TODO: Center-of-mass, with room for messy, off-kilter writing

    // Question: What should be returned when no symbol is found?
    return -1; // for now, an invalid flag
}



// Scrape all the valid numbers from the provided tesseract job
// if above threshold
// Returns them in an array
function getSymbols(tess_job, threshold = 60){

    result = [];

    tess_job.symbols.forEach( function(s) {
        if( s.confidence > threshold ){
            result.push(s);
            console.log("Pushed: " + s.text);
        }
    });

    return result;
}
