// Takes an image, attempts to grab a matrix from it
function img2mat(img, dim) {

    var confidence_threshold = 55;

    Tesseract.recognize(img)
        .catch(function (e) {
            console.log(e);
            return;
        })
        .then(function (result) {

            //console.log(result)
            var t_m = [];

            // find nums line by line
            for (i = 0; i < dim; i++) {
                var line = result.lines[i];
                console.log(line);
                t_m[i] = [];

                // iterate through the symbols.
                // add them if their conf is > 66
                for (j = 0; j < dim; j++) {
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

            return t_m
        })
}