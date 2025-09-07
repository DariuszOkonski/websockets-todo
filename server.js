const express = require('express');

const app = express();

const PORT = process.env.PORT || 8000;

const server = app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running at port ${PORT}...`);
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
