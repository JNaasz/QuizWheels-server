const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const PORT = process.env.PORT || 1339;
const app = express();
const fs = require('fs-extra');

// const state = require('./lib/state');
// state.restore();

app.use(bodyParser.json({ type: 'application/json' }));
app.use(express.static('public'));

app.get('/topics', (req, res) => {
  getTopics()
    .then(topics => {
      console.log('got the topics, retuning stringified response');
        res.send(
          JSON.stringify(topics)
        );
    })
});

app.listen(PORT, function(err) {
  if (err) {
    console.error('oops', err);
  }
  console.log('listening on ', PORT);
});

function getTopics() {
  let filename = path.resolve(__dirname, `QuizWheels.json`);
  const exists = fs.existsSync(filename);

  if (!exists) return Promise.reject();

  return new Promise(function(resolve, reject){
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err);
      console.log(`Returning Data for ${filename}`)
      resolve(data);
    });
  });
}