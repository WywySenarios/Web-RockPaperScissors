/*
 * games: [[p1, p2], etc.]
 */

function defaultTestCases() {
	return [[1, 1], [1, 2], [1, 3], [2, 1], [2, 2], [2, 3], [3, 1], [3, 2], [3, 3]];
}

function testCases() {
	return defaultTestCases();
}

function run() {
	let results = Array(0);
	let runtime = 0;
	let games = testCases();
	let start;
	let end;

	// standard
	start = performance.now();
	results.push(RPSstandard(games));
	end = performance.now();
	runtime = end - start;
	console.log(`${runtime}ms`);
	console.log(results[0]);
	sleep(1000)

	// optimized
	start = performance.now();
	results.push(RPSoptimized(games));
	end = performance.now();
	runtime = end - start;
	console.log(`${runtime}ms`);
	console.log(results[0]);
	sleep(1000);


	// zeroes
	start = performance.now();
	results.push(RPSzeroes(games));
	end = performance.now();
	runtime = end - start;
	console.log(`${runtime}ms`);
	console.log(results[0]);
	sleep(1000);

	// noComparisons AKA Polynomial
	start = performance.now();
	results.push(RPSnoComparisons(games));
	end = performance.now();
	runtime = end - start;
	console.log(`${runtime}ms`);
	console.log(results[0]);
	sleep(1000);
	// μ

	// send results to server
	const data = {
		standardDEBUG: "standard",
		optimizedDEBUG: "optimized",
		zeroesDEBUG: "zeroes",
		polynomialDEBUG: "polynomial"
	}

	fetch("/upload", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});

	// note that this function is complete.
	console.log("'Run' Complete.");
}

function sleep(ms) {
	let a = new Promise(resolve => setTimeout(resolve, ms));
	a.then(() => { return; });
}

// Returns an array with the execution results
function RPSstandard(games) {
	let results = Array(0);

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

	return results;
}

// Returns an array with the execution results
function RPSoptimized(games) {
	let results = Array(0);

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

	return results;
}

// Returns an array with the execution results
function RPSzeroes(games) {
	let results = Array(0);

	for (let i = 0; i < games.length; i++) {
		let game = games[i][0] * 10 + games[i][1]; // [p1][p2]

		if ((game - 11) * (game - 22) * (game - 33) == 0) { // tie
			results.push(0);
		} else if ((game - 13) * (game - 21) * (game - 32) == 0) { // P1 wins
			results.push(1);
		} else {
			results.push(2);
		}
	}

	return results;
}

// Returns an array with the execution results
function RPSnoComparisons(games) {
	let results = Array(0);

	for (let i = 0; i < games.length; i++) {
		/*
		 * Polynomial equation that satisfies the following points:
		 * (1,1,0) (2,2,0) (3,3,0)
		 * (1,3,1) (2,1,1) (3,2,1)
		 * (1,2,2) (2,3,2) (3,1,2)
		 */
		let x = games[i][0];
		let z = games[i][1];

		results.push(Math.round((x - z) * (x + -2.66069 * z) * (x + -0.753293 * z) * (x + -2.96691 * z) * (x + -0.751818 * z) * (x + -1.48948 * z) * (x + -0.33313 * z) * (x + -0.751626 * z) * (x + -1.05309 * z)));
	}

	return results;
}