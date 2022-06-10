// ************** Modules ************** //
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

// ************* Variables ************* //
const PORT = process.env.PORT || 8000;
const { reactors } = require('./public/js/reactors-data');

// ************* Middleware ************ //
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// *********** CRUD framework *********** //
// path '/' servers up (GETS) the 'index.ejs' file and required data
app.get('/', function (request, response) {
  response.render('index', {reactorsArr: reactors});   
});

// default path '/about' GETS the '/about.html' file and required data
app.get('/about', function (request, response) {
  response.render('about', {reactorsArr: reactors});  
});

// path '/api/' GETS the adv. reactors API - Not filtered
app.get('/api/', (request, response) => {
  // save request to reactorName and converts to lowerCase
  response.json(reactors);
});

// path '/api/:name' GETS the adv. reactors API - filtered by NAME
app.get('/api/:name', (request, response) => {
  // save request to reactorName and converts to lowerCase
  const reactorName = request.params.name.toLowerCase();
  console.log(`Entered: ${reactorName}`);

  if (reactors.filter((elem) => elem.name.toLowerCase() === reactorName.toLowerCase())) {
    response.json(
      reactors.filter((elem) => elem.name.toLowerCase() === reactorName.toLowerCase())
    );
  } else {
    response.status(404).end();
  }
});

// Listens on Server using PORT variable
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// *********** DATA SCRAPPER SCRIPT *********** //

// Scrape source
const url = 'https://en.wikipedia.org/wiki/List_of_small_modular_reactor_designs';

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $('tbody > tr');
    // Stores data for all reactors
    var reactorsList = [];

    // Use .each method to loop through the li we selected
    listItems.each((index, el) => {
      // Object holding data for each reactorDesign

      const reactorDesign = {
        name: '',
        nameLink: '',
        grossPower: '',
        type: '',
        typeLink: '',
        producer: '',
        producerLink: '',
        country: '',
        status: '',
      };

      // Select the text content of a and span elements
      // Store the textcontent in the above object
      reactorDesign.name = $(el).children('td:nth-child(1)').text().trim();
      reactorDesign.nameLink = $(el).children('td:nth-child(1)').find('a').attr('href');
      reactorDesign.grossPower = $(el).children('td:nth-child(2)').text().trim();
      reactorDesign.type = $(el).children('td:nth-child(3)').text().trim();
      reactorDesign.typeLink = $(el).children('td:nth-child(3)').find('a').attr('href');
      reactorDesign.producer = $(el).children('td:nth-child(4)').text().trim();
      reactorDesign.producerLink = $(el)
        .children('td:nth-child(4)')
        .find('a')
        .attr('href');
      reactorDesign.country = $(el).children('td:nth-child(5)').text().trim();
      reactorDesign.status = $(el).children('td:nth-child(6)').text().trim();

      // Populate reactorsList array with reactorDesign data
      reactorsList.push(reactorDesign);
    });

    // Logs reactorsList array to the console
    // console.dir(reactorsList);

    // Write reactorsList array in reactors-data.js file
    fs.writeFile(
      'reactors-data.js',
      `exports.reactors = ` + JSON.stringify(reactorsList, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Successfully written data to file');
      }
    );
  } catch (err) {
    console.error(err);
  }
}
// ******* Uncomment to invoke the function and run the scraper ******* //
// scrapeData();
