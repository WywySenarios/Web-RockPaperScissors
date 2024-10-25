let charts = {};

// returns [labels, runtime] or an empty array given an error
async function getChartData(trialID, algorithmName) {
	try {
		let response = await fetch("/graph" + "?algorithmName=" + algorithmName + "&trialID=" + trialID, {
			method: "GET"
		});

		const data = await response.json();
    let labels = Array(0);
    let runtime = Array(0);
    for (let i = 0; i < data["content"].length; i++) {
      await runtime.push(data["content"][i][0]);
      await labels.push(data["content"][i][1]);
    }

		return await [labels, runtime];
	} catch (error) {
		console.error(`ERROR: ${error.message}\n\nGraph will now be empty`);
		return [];
	}
}


// returns the chart that has been set
async function setChart(trialID, algorithmName, chartElement) {
  let dataIn = await getChartData(trialID, algorithmName);

  return await new Chart(chartElement, {
    type: 'bar',
    data: {
      labels: dataIn[0],
      datasets: [{
        label: 'Runtime Ascending Order',
        data: dataIn[1],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function chart(id) {
  try {charts[id].destroy();} catch (error) {} // delete a chart if it's already there so a new one may be generated

  charts[id] = await setChart(document.getElementById(id + " select").value, document.getElementById(id + " algorithm").value, document.getElementById(id));
}