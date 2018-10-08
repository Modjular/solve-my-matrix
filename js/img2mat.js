// Takes a TesseractJob, attempts to parse it into a matrix.
// TODO: Robustification
function parseTessJob(job, dim) {

    var confidence_threshold = 55;

    console.log("parsing job... ");
    console.log(job);
    var t_m = [];

    // find nums line by line
    for (i = 0; i < dim; i++) {
        var line = job.lines[i];
        t_m[i] = [];
        for(let j = 0; j < dim; j++){t_m[i][j] = 0;} //initialized to all zero

        // iterate through the symbols.
        // add them if their conf is > 66
        /*
            1. Omit non-digit symbols
            2. Sort by confidence
            3. Grab (up to) top 3
            4. Find relative positions, insert into most relative column
        */

        let count = 0;  // t_m[i][j]
        let j = 0;      // More of an iterator

        while (count < dim) {

            if (line.symbols[j.toString()].confidence > confidence_threshold) {
                t_m[i][count] = parseFloat(line.symbols[j.toString()].text));
                count++;
            }

            j++;
        }
    }

    return t_m

}
