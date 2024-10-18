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
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');

//const cppAddon = require('.build/Release/randomizeTestCases');

//console.log(cppAddon.hello());

// important constants
const port = 5322;
const app = express();

app.use(cors()); // allow input from ANY ip address
app.use(bodyParser.json()); // allow JSON input (related to the POST function)

app.use(express.static(__dirname + '/public')); // allow file access in the "public" folder

app.use(express.urlencoded({
  extended: false, // use complex algorithm for large amounts of nested data?
  limit: 10000, // limit in bit thingies (a 0 or 1)
  parameterLimit: 5 // max # items
}));

// error handling;
// app.use((err, req, res, next) => {
//   console.log("error function has run.");
//   return res.json({ errorMessage: err.message });
// });

const upload = multer({ dest: 'files/' });


// GET requests for test cases
app.get('/testCases/10000000', (req, res) => {
  var data = {"Content": randomizeTestCases(10000000) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});
app.get('/testCases/1000000', (req, res) => {
  var data = {"Content": randomizeTestCases(1000000) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});
app.get('/testCases/100000', (req, res) => {
  var data = {"Content": randomizeTestCases(100000) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});
app.get('/testCases/10000', (req, res) => {
  var data = {"Content": randomizeTestCases(10000) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});
app.get('/testCases/1000', (req, res) => {
  var data = {"Content": randomizeTestCases(1000) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});
app.get('/testCases/100', (req, res) => {
  var data = {"Content": randomizeTestCases(100) };

  console.log("Sending test cases...");

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(data));
  res.end();
});



// POST request for the user to upload RPS runtime results
app.post('/upload', (req, res) => {
  console.log(`Receiving Data:${JSON.stringify(req.body)}:END-Receiving Data`); // note what input has been given in logs

  // handle upload
  res.status(204);
  res.end();
});

app.listen(port, () => {
  console.log(`Server online at port ${port}.`);
});