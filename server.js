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

function boot() {
  const express = require('express');
  const cors = require('cors');
  const multer = require('multer');
  const port = 5322;
  const app = express();

  app.use(cors()); // allow input from ANY ip address

  // const urlEncodedParams = express.urlencoded({
  //   extended : false, // use complex algorithm for large amounts of nested data?
  //   limit: 10000, // limit in bit thingies (a 0 or 1)
  //   parameterLimit: 5 // max # items
  // });

  app.use(express.static(__dirname));

  app.use(express.urlencoded({
    extended: false, // use complex algorithm for large amounts of nested data?
    limit: 10000, // limit in bit thingies (a 0 or 1)
    parameterLimit: 5 // max # items
  }));

  const upload = multer({ dest: 'files/' });

  // get commands
  // app.get("/", (req, res) => {
  //   console.log("GET command received.");
  //   res.sendFile("index.html", {root: __dirname});
  // });

  app.post('/', (req, res) => {
    console.log("Empty Post");
  });

  app.post('/upload', (req, res) => {
    // handle upload
    console.log("Receiving Data:");
    // console.log(req);
    console.log(req.body);
    // console.log(req.files);
    console.log("END: Receiving Data");
  });

  app.listen(port, () => {
    console.log(`Server online at port ${port}.`)
  });
}

boot();