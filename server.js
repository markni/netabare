const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 8777;

app.use('/', express.static(path.join(__dirname, 'dist')));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () =>
  console.log(`http://netaba.re front-end server is up at http://localhost:${port}`)
);
