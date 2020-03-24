const express = require('express');
const morgan = require('morgan');

const app = express();

const apps = require('./playstore.js');

app.get('/apps', (req, res) =>{
  const { search = '' } = req.query;

  let appName = apps
    .filter(app =>
      app
        .App
        .toLowerCase()
        .includes(search.toLowerCase()));
  
  
  res
    .json(appName);    

});

app.listen(8000, () => {
  console.log('Listening on server 8000!');
});
