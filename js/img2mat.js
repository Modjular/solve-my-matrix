// Takes a TesseractJob, attempts to parse it into a matrix.
// TODO: Robustification
function parseTessJob(job, dim) {

    var confidence_threshold = 55; // I know I have really low standards

    console.log("\nparsing job... \n");
    console.log(job); //TODO DEBUG

    var t_m = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    // find nums line by line
    for (i = 0; i < dim; i++) {
        var line = job.lines[i];
        for(let j = 0; j < dim; j++){t_m[i][j] = 0;} //initialized to all zero

        // iterate through the symbols.
        // add them if their conf is > 66
        /*
            1. Omit non-digit symbols
            2. Sort by confidence
            3. Grab (up to) top 3
            4. Find relative positions, insert into most relative column

            Python Pseudo hahahaha

            if overall-confidence < overall_conf_threshold and every cell has a valid symbol:
                throw error("We're not quite sure what you took a picture of")

            candidates = []

            for line in line:
                for sym in line:
                    if sym.confidence > threshold and sym.text in whitelisted_chars:
                        candidates.append(float(sym.text))

            - another idea

            for cell in matrix

        */





        let count = 0;  // t_m[i][j]
        let j = 0;      // More of an iterator

        while (count < dim) {

            if (line.symbols[j.toString()].confidence > confidence_threshold) {
                t_m[i][count] = parseFloat(line.symbols[j.toString()].text);
                count++;
            }

            j++;
        }
    }

    return t_m

}
