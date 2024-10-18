/*
 * games: [[p1, p2], etc.]
 */

function defaultTestCases() {
	return "111213212223313233";
}

// length should be a STRING
async function serverTestCases(length) {
	try {
		let response = await fetch("/testCases/" + length, {
			method: "GET"
		});

		const json = await response.json();
		// console.log(`Received Test Cases ${json["Content"]}`);
		return await testCases(json["Content"]);
	} catch (error) {
		console.error(`${error.message}\n\nProceeding to use default test cases...`);
		return await defaultTestCases();
	}
}

async function testCases(gamesStr) {
	// console.log(`Test cases to process: ${gamesStr}`);
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
		await output.push([next[0], next[1]]);
		// console.log(`Inside for loop output: ${output}`);
	}

	// uncomment out the four lines of code to help debug
	// console.log(gamesStr.length);
	// console.log(output.length);
	// console.log(`Test 1: ${output[0][0]}, ${output[0][1]}; Test 2: ${output[1][0]}, ${output[1][1]}`);
	//console.log(`Inside function output: ${output}`);
	return output;
}

async function runInit() {
	await run("100");
	await run("1000");
	await run("10000");
	await run("100000");
	await run("1000000");
	// run("10000000");
}

// run all algorithms in a random order with "games" as the test cases
async function run(numTestCases) {
	games = await serverTestCases(numTestCases);
	// console.log("Test cases: " + games);
	let runtime = NaN;
	let start;
	let end;

	let algorithms = [["standard", RPSstandard], ["optimized", RPSoptimized], ["zeroes", RPSzeroes], ["polynomial", RPSnoComparisons]];
	let results = {
		"runtime": {
			"standard": NaN,
			"optimized": NaN,
			"zeroes": NaN,
			"polynomial": NaN
		},
		"executionResults": {
			"standard": null,
			"optimized": null,
			"zeroes": null,
			"polynomial": null
		}
	};

	// run all algorithms in a random order while keeping track of runtime
	let index = 0;
	let output = null;
	let userOutput = null;
	let currentLength = algorithms.length;
	while (currentLength > 0) {
		index = Math.round(Math.random() * algorithms.length); // pick a random algorithm to run
		if (algorithms[index] == null) {
			continue;
		} else {
			console.log(`Testing algorithm: ${algorithms[index][0]}`);
			currentLength--;
		}
		// console.log(`Index: ${index}, length: ${algorithms.length}`);
		// console.log(algorithms[index]);

		await sleep(3000); // sleep to ensure that CPU usage is spread out and does not severely impact runtime
		output = await algorithms[index][1](games);
		output[0] = Math.round(output[0] * 1000) / 1000 // round to 1 decimal place??

		// console.log(`Output: ${output}`);
		userOutput = document.getElementById(algorithms[index][0] + numTestCases);
		userOutput.innerHTML = output[0];
		results["runtime"][algorithms[index][0]] = output[0];
		results["executionResults"][algorithms[index][0]] = output[1];
		if (await ! await delete algorithms[index]) {
			console.log("Failed to delete array element. \"run()\" function failed. Aborting...");
			return;
		}
	}
	// μ

	// send results to server
	console.log("Data to send: " + JSON.stringify(results["runtime"]));

	fetch("/upload#lolers", {
		method: "POST",
		body: JSON.stringify(results["runtime"]),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
	});

	// note that this function is complete.
	console.log("'Run' Complete.");
}

async function sleep(ms) {
	await new Promise(r => setTimeout(r, ms));
}



// Below are RPS functions. They return an array with [runtime, execution results].

async function RPSstandard(games) {
	let results = Array(0);

	runtime = await performance.now();
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

	runtime = await performance.now() - runtime;
	return [runtime, results];
}

// Returns an array with the execution results
async function RPSoptimized(games) {
	let results = Array(0);

	runtime = await performance.now();
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

	runtime = await performance.now() - runtime;
	return [runtime, results];
}

// Returns an array with the execution results
async function RPSzeroes(games) {
	let results = Array(0);

	runtime = await performance.now();
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

	runtime = await performance.now() - runtime;
	return [runtime, results];
}

// Returns an array with the execution results
async function RPSnoComparisons(games) {
	let results = Array(0);

	runtime = await performance.now();
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

	runtime = await performance.now() - runtime;
	return [runtime, results];
}