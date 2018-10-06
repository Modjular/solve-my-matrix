var newImg = new Image;
var tess_result;
var dimension = 3;
var confidence_threshold = 55;

console.log("BEGINNING TEST");

newImg.onload = function () {
    Tesseract.recognize(newImg)
        .then(function (result) {
            console.log(result)
            var t_m = [];

            // find nums line by line
            for (i = 0; i < dimension; i++) {
                var line = result.lines[i];
                console.log(line);
                t_m[i] = [];

                // iterate through the symbols.
                // add them if their conf is > 66
                for (j = 0; j < dimension; j++) {
                    if (line.symbols[j.toString()].confidence > confidence_threshold) {
                        t_m[i].push(parseFloat(line.symbols[j.toString()].text));
                    }
                }
            }


            t_m.forEach(function (row) {
                console.log(row);
            })
        
            var t_m_ops = rref(t_m);
            var BIGM = rref_parser(t_m, t_m_ops);
        
            BIGM.forEach(function (row) {
                console.log(row);
            })
        })
};

newImg.src = 'matrix_test1.jpeg';


var testM = [
    [1, 2, 3],
    [1, 1, 1],
    [4, 5, 6]
];
