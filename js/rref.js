// Reduces matrix 'original' to RREF form (if possible)
// non-destructive, returns a new matrix
// Reference: https://www.csun.edu/~panferov/math262/262_rref.pdf
function rref(original) {

    var ops = [];
    var M = []; // a new copy
    for (i = 0; i < original.length; i++) {
        M[i] = original[i].slice();
    }

    var m = M.length;
    var n = M[0].length;

    //Check edge cases?

    // 1. From left, find the first column that contains a leading entry
    // 2. Swap rows until pivotal row is on top
    // 3. Use elementary modifications to zero-out the other entries
    // 4. Repeat 1-3 until there is a pivot in each row or until the
    //    last submatrix is all zeroes


    // REDUCED ROW ECHELON FORM

    var i = 0; // row
    var j = 0; // column

    while (i < m && j < n) {
        var p = getFirstPivot(M, i, j);

        if (M[p][j] == 0) { //if p is still zero, increment j
            j++;
        } else {

            if (p != i) { // If p is not top, swap
                //"R" + p + " <-> " + "R" + i);
                let new_op = ['s', p, i];
                ops.push(new_op);
                swapRows(M, p, i);
                
                p = i;
            }

            if (M[p][j] != 1) { //if pivot is not already 1, divide
                //"R" + p + " * " + (1 / M[p][j]));
                let new_op = ['m', p, (1 / M[p][j])];
                ops.push(new_op);
                multRow(M, p, 1 / M[p][j]); //TODO replace inline
            }

            // Diff between REF and RREF is r=i or r=0
            for (var r = 0; r < m; r++) { // Subtract pivot from other rows
                if (r != p && M[r][j] != 0) {
                    //"R" + r + " = R" + r + " + " + -M[r][j] + "R" + p);
                    let new_op = ['a', r, p, -M[r][j]];
                    ops.push(new_op);
                    addRows(M, r, p, -M[r][j]); //TODO replace inline
                }
            }
            i++;
            j++;
        }
    }

    return ops;
}


// rref above will spit out an instruction list. Running 'original'
// through this parser will commit the actual changes.
/*
    - operations: 
        -s: will expect 2 parameters
        -m: will expect 2 parameters
        -a: will expect 3 parameters
        
    example:
        
        ['s', 0, 2] // swap R0 and R2
*/
function rref_parser(original, ops){
    
    var M = []; // a new copy
    for (i = 0; i < original.length; i++) {
        M[i] = original[i].slice();
    }
    
    for(i = 0; i < ops.length; i++){
        console.log(ops[i][0]);
        switch(ops[i][0]){
            case 's': //swap
                swapRows(M, ops[i][1], ops[i][2]);
                break;
            case 'a':
                addRows(M, ops[i][1], ops[i][2], ops[i][3]);
                break;
            case 'm':
                multRow(M, ops[i][1], ops[i][2]);
                break;
        }
    }
    
    return M;
}

// Returns the j-index of the closest non-zero pivot in column 'col',
// starting at row 'row'
function getFirstPivot(m, row, col) {
    for (var i = row; i < m.length; i++) {
        if (m[i][col] != 0) {
            return i;
        }
    }

    return row; // If all zeros, row will be returned.
}

// swap row m[a] with m[b]
function swapRows(m, a, b) {
    var temp = m[a].slice(); // Copy by value, not reference
    m[a] = m[b];
    m[b] = temp;
}

// a * c
function multRow(m, a, c) {
    for (var i = 0; i < m[a].length; i++) {
        if (m[a][i] != 0)
            m[a][i] *= c;
    }
}

// a + b
function addRows(m, a, b, c) {
    for (var i = 0; i < m[a].length; i++) {
        m[a][i] += c * m[b][i];
    }
}
