/*
 * games: [[p1, p2], etc.]
 */

function defaultTestCases() {
    return [[1,1], [1,2], [1,3], [2,1], [2,2], [2,3], [3,1], [3,2], [3,3]];
}

function run() {
    let runtime = 0;
    for (let i = 0; i < 100; i++) {
        runtime += RPSstandard(defaultTestCases());
    }
    console.log(`${runtime}ms`);
    // setTimeout(() => {RPSstandard(defaultTestCases())}, 1000);

    // μ
}

// Returns runtime in ms
function RPSstandard(games) {
    let results = Array(0);
    const start = performance.now();
    for (let i = 0; i < games.length; i++) {
        if (games[i][0] == games[i][1]) { // tie
			results.push(0);
		} else if (games[i][0] == 1) { // p1 rock
			if (games[i][1] == 2) { // p2 papers
				results.push(2);
			} else {
				results.push(1);
			}
		} else if (games[i][0] == 2) { // p1 paper
			if (games[i][1] == 1) { // p2 rock
				results.push(1);
			} else {
				results.push(2);
			}
		} else { // p1 scissors
			if (games[i][1] == 2) { // p2 paper
				results.push(1);
			} else {
				results.push(2);
			}
		}
    }

    const end = performance.now();
    return end - start;
}

// Returns runtime in ms
function RPSoptimized(games) {
    let results = Array(0);
    const start = performance.now();
    for (let i = 0; i < games.length; i++) {
		if (games[i][0] == games[i][1]) { // tie
			results.push(0);
		} else if (games[i][0] == (-3 * games[i][1] * games[i][1] + 11 * games[i][1] - 4) / 2) { // P1 wins
			// the above quadratic equation converts p2 into a value equal to p1 when P1 wins.
			// this means that the quadratic equation has points (1,3), (2,1), and (3,2)
			results.push(1);
		} else {
            results.push(2);
		}
    }
    
    const end = performance.now();
    return end - start;
}

// Returns runtime in ms
function RPSnoComparisons(games) {
    let results = Array(0);
    const start = performance.now();
    for (let i = 0; i < games.length; i++) {
		/*
		 * Polynomial equation that satisfies the following points:
		 * (1,1,0) (2,2,0) (3,3,0)
		 * (1,3,1) (2,1,1) (3,2,1)
		 * (1,2,2) (2,3,2) (3,1,2)
		 */
		let x = games[i][0];
		let z = games[i][1];
		
		results.push(Math.round((x - z) *(x + -2.66069 * z) * (x + -0.753293 * z) * (x + -2.96691 * z) * (x + -0.751818 * z) * (x + -1.48948 * z) * (x + -0.33313 * z) * (x + -0.751626 * z) * (x + -1.05309 * z)));
    }
    
    const end = performance.now();
    return end - start;
}