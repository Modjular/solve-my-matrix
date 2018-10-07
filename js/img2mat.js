// Takes a TesseractJob, attempts to parse it into a matrix.
// TODO: Robustification
function parseTessJob(job, dim) {

    var confidence_threshold = 55;

    console.log("job: ");
    console.log(job);
    var t_m = [];

    // find nums line by line
    for (i = 0; i < dim; i++) {
        var line = job.lines[i];
        t_m[i] = [];

        // iterate through the symbols.
        // add them if their conf is > 66
        let count = 0;
        let j = 0;

        while (count < dim) {

            if (line.symbols[j.toString()].confidence > confidence_threshold) {
                t_m[i].push(parseFloat(line.symbols[j.toString()].text));
                count++;
            }

            j++;
        }
    }

    return t_m

}
