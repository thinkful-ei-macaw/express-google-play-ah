const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const appsData = require('./playstore.js');

app.get('/', (req, res) => {
  res.json({ message: 'Greetings, Nematodes!' });
});

app.get('/apps', (req, res) => {
  let { sort, genre } = req.query;
  let results = appsData;

  // try to set this up to throw an error if word is not entered right
  // Dealing with the sort query:
  
  
  if (sort) {
    let firstLetter = sort.slice(0, 1).toUpperCase();
    let remainder = sort.slice(1).toLowerCase();
    sort = firstLetter + remainder;
    // check if this array does not include value
    if (!['Rating', 'App'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
  }

  if (sort) {
    results
      .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : 
          a[sort] < b[sort] ? -1 : 0;
      });
  }  

  // Dealing with the genres query:
  const possibleGenres = ['Action', 'Puzzle', 'Strategy', 'Arcade', 'Card'];

  
  if (genre) {
    let firstGenreLetter = genre.slice(0, 1).toUpperCase();
    let remainderGenre = genre.slice(1).toLowerCase();
  
    genre = firstGenreLetter + remainderGenre;
    console.log(results);
    if (!possibleGenres.includes(genre)) {
      return res
        .status(400)
        .send('genre must be one of action, puzzle, strategy, arcade or card');
    } 

    results = results.filter(result => result.Genres.includes(genre));
  }


  res
    .json(results);
});


module.exports = app;
