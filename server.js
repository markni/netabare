const express = require('express');
const app = express();
const path = require('path');

console.log(path.join(__dirname, 'dist'));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(8777, () =>
  console.log('http://netaba.re server is up at http://localhost:8777')
);
