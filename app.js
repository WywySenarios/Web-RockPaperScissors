// const readline = require('node:readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

function randomizeTestCases(numGames) {
  let output = "";

  for (let i = 0; i < numGames; i++) {
    output += Math.round(1 + Math.random() * 2).toString() + Math.round(1 + Math.random() * 2).toString();
  }

  //console.log("Test cases generated: " + output)
  return output;
}

// function shuffleTestCases() { }

// imports
const express = require('express');
const urlLibrary = require('url');
const cors = require('cors');
// const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const childProcess = require("child_process");

//const cppAddon = require('.build/Release/randomizeTestCases');
//console.log(cppAddon.hello());

// constants
const port = 5322;
const app = express();

app.use(cors()); // allow input from ANY ip address
app.use(bodyParser.json()); // allow JSON input (related to the POST function)

app.use(express.static(__dirname + '/public')); // allow file access in the "public" folder

app.use(express.urlencoded({
  extended: true, // use complex algorithm for large amounts of nested data?
  limit: 10000, // limit in bit thingies (a 0 or 1)
  parameterLimit: 5 // max # items
}));

// const upload = multer({ dest: 'files/' });


// GET requests for test cases
function respondTestCases(req, res, numTestCases) {
  var data = { "Content": randomizeTestCases(numTestCases) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
}

app.get('/testCases/100', (req, res) => { respondTestCases(req, res, 100); });
app.get('/testCases/1000', (req, res) => { respondTestCases(req, res, 1000); });
app.get('/testCases/10000', (req, res) => { respondTestCases(req, res, 10000); });
app.get('/testCases/100000', (req, res) => { respondTestCases(req, res, 100000); });
app.get('/testCases/1000000', (req, res) => { respondTestCases(req, res, 1000000); });
app.get('/testCases/10000000', (req, res) => { respondTestCases(req, res, 10000000); });

app.get('graph', (req, res) => {

});


// Do NOT use "data" or "type" as the incomingIndex variable
function appendJSON(filePath, incomingIndex, infoToAdd) {
  let data;
  try {
    const dataFile = fs.readFileSync(filePath);
    data = JSON.parse(dataFile.toString());
    console.log(`Data (before): ${JSON.stringify(data)}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      data = {};
    } else {
      throw error;
    }
  }
  // data is only printed before because the data afterwards may be accessed through the file itself or the next write function's state before writing.
  data[incomingIndex] = infoToAdd;

  //remove weird readFileSync behaviour
  delete data["type"];
  delete data["data"];
  // console.log(`Data (after): ${JSON.stringify(data)}`);
  const output = fs.writeFileSync(filePath, JSON.stringify(data));
}


// POST request for the user to upload RPS runtime results
app.post('/upload', (req, res) => {
  data = req.body
  console.log(`Receiving Data:${JSON.stringify(data)}:END-Receiving Data`); // note what input has been given in logs
  let username = data["name"];
  let userID = username + "_" + Date.now().toString(); // ID is always unique even if the same person comes back to the program at a later date
  delete data["name"];
  // add all data to master file
  appendJSON("files\\master.json", userID, data);

  // add data to individual trial files
  for (const key in data) {
    try {
      appendJSON("files\\" + key + ".json", userID, data[key]);
    } catch(error) {
      console.log("User tried to run a test case that the server didn't recognize?");
    }
  }

  // the code below is disabled because graph.js already generates graphs,
  // so I don't need 
  // setup & run bash file
  // const bash_run = childProcess.spawn(
  //   'cmd.exe', ['/c', "graphs.bat"], { env: process.env });
  // bash_run.stdout.on('data', function (data) {
  //   console.log('graphs.bat: ' + data);
  // });
  // bash_run.stderr.on('data', function (data) {
  //   console.log('graphs.bat ERROR: ' + data);
  // });
  // END setup & run bash file

  // Tell client that their data has been successfully sent & stored
  res.status(204);
  res.end();
});

app.listen(port, () => {
  console.log(`Server online at port ${port}.`);
});