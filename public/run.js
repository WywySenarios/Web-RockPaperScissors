/*
 * games: [[p1, p2], etc.]
 */

function defaultTestCases() {
	return "111213212223313233";
}

async function serverTestCases() {
	try {
		let response = await fetch("/testCases", {
			method: "GET"
		});

		const json = await response.json();
		// console.log(`Received Test Cases ${json["Content"]}`);
		run(await testCases(json["Content"]));
	} catch (error) {
		console.error(`${error.message}\n\nProceeding to use default test cases...`);
		run(await defaultTestCases());
	}
}

async function testCases(gamesStr) {
	console.log(`Test cases to process: ${gamesStr}`);
	let output = Array(0);
	let next = Array(2);
	for (let i = 0; i < gamesStr.length / 2; i++) {
		switch (gamesStr.charAt(2 * i)) {
			case "1":
				next[0] = 1;
				break;
			case "2":
				next[0] = 2;
				break;
			case "3":
				next[0] = 3;
				break;
			default:
				continue;
		}
		switch (gamesStr.charAt(2 * i + 1)) {
			case "1":
				next[1] = 1;
				break;
			case "2":
				next[1] = 2;
				break;
			case "3":
				next[1] = 3;
				break;
			default:
				continue;
		}

		// uncomment out the two lines of code to help debug
		// console.log(`adding: ${next}`);
		output.push([next[0], next[1]]);
		// console.log(`Inside for loop output: ${output}`);
	}

	// uncomment out the three lines of code to help debug
	// console.log(gamesStr.length);
	// console.log(output.length);
	// console.log(`Test 1: ${output[0][0]}, ${output[0][1]}; Test 2: ${output[1][0]}, ${output[1][1]}`);
	console.log(`Inside function output: ${output}`);
	return output;
}

function runInit() {
	serverTestCases();
}


function run(games) {
	let results = Array(0);
	let runtime = 0;
	let runtimeResults = [];
	console.log("Test cases: " + games);
	let start;
	let end;

	// standard
	start = performance.now();
	results.push(RPSstandard(games));
	end = performance.now();
	runtime = end - start;
	runtimeResults.push(runtime);
	sleep(1000)

	// optimized
	start = performance.now();
	results.push(RPSoptimized(games));
	end = performance.now();
	runtime = end - start;
	runtimeResults.push(runtime);
	sleep(1000);


	// zeroes
	start = performance.now();
	results.push(RPSzeroes(games));
	end = performance.now();
	runtime = end - start;
	runtimeResults.push(runtime);
	sleep(1000);

	// noComparisons AKA Polynomial
	start = performance.now();
	results.push(RPSnoComparisons(games));
	end = performance.now();
	runtime = end - start;
	runtimeResults.push(runtime);
	sleep(1000);
	// μ

	// send results to server
	const data = {
		standardDEBUG: runtimeResults[0].toString(),
		optimizedDEBUG: runtimeResults[1].toString(),
		zeroesDEBUG: runtimeResults[2].toString(),
		polynomialDEBUG: runtimeResults[3].toString()
	}
	console.log("Execution Results: " + results.toString());

	console.log("Data to send: " + JSON.stringify(data));

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