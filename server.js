const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function bootQuestion() {
  rl.question(`Press ENTER to boot, press CTRL + C to exit.`, answer => {
    boot();
  });
}

function randomizeTestCases(numGames) {
  let output = "";

  for (let i = 0; i < numGames; i++) {
    output += `${1 + Math.round(Math.random() * 2)}${Math.round(1 + Math.random() * 2)}`;
  }

  return output;
}

function shuffleTestCases() {}

function boot() {
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

  app.use(express.static(__dirname + '/public')); // allow file access in root directory

  app.use(express.urlencoded({
    extended: false, // use complex algorithm for large amounts of nested data?
    limit: 10000, // limit in bit thingies (a 0 or 1)
    parameterLimit: 5 // max # items
  }));

  const upload = multer({ dest: 'files/' });

  app.get('/testCases', (req, res) => {
    let testCases = randomizeTestCases();
    console.log(`Sending test cases: ${testCases}`);
    res.send(testCases.toString("utf-8"));
    res.status(200);
  });

  app.post('/upload', (req, res) => {
    // handle upload
    console.log(`Receiving Data:${req.body}:END-Receiving Data`); // note what input has been given in logs

    res.status(204);
  });

  app.listen(port, () => {
    console.log(`Server online at port ${port}.`);
  });
}

boot();