// ************** Modules ************** //
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const PORT = process.env.PORT || 8000;
const { reactors } = require('./reactors-data');

// ************* Middleware ************ //
app.use(cors());

// *********** CRUD framework *********** //
// default path '/' serves up the '/index.html' file
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

// path '/api/:name' serves up the adv. reactors API
app.get('/api/:name', (request, response) => {
  // save request to reactorName and converts to lowerCase
  const reactorName = request.params.name.toLowerCase();
  console.log(`Entered: ${reactorName}`);

  if (reactors.filter((elem) => elem.name.toLowerCase() === reactorName.toLowerCase())) {
    response.json(reactors.filter((elem) => elem.name.toLowerCase() === reactorName.toLowerCase()));
  } else {
    response.status(404).end();
  }
});

// Listens to Server on PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// *********** DATA SCRAPPER SCRIPT *********** //

// Scrape source
const url =
  'https://en.wikipedia.org/wiki/List_of_small_modular_reactor_designs';

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the list items in plainlist class
    const listItems = $('tbody > tr');
    // Stores data for all countries
    var countries = [];

    // Use .each method to loop through the li we selected
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction

      const country = {
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
      country.name = $(el).children('td:nth-child(1)').text().trim();
      country.nameLink = $(el).children('td:nth-child(1)').find('a').attr('href');  
      country.grossPower = $(el).children('td:nth-child(2)').text().trim();
      country.type = $(el).children('td:nth-child(3)').text().trim();
      country.typeLink = $(el).children('td:nth-child(3)').find('a').attr('href'); 
      country.producer = $(el).children('td:nth-child(4)').text().trim();
      country.producerLink = $(el).children('td:nth-child(4)').find('a').attr('href'); 
      country.country = $(el).children('td:nth-child(5)').text().trim();
      country.status = $(el).children('td:nth-child(6)').text().trim();

      // Populate countries array with country data
      countries.push(country);
    });

    // Logs countries array to the console
    // console.dir(countries);


    // Write countries array in countries.json file
    fs.writeFile(
      'reactors-data.js',
      `exports.reactors = ` + JSON.stringify(countries, null, 2),
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
// Invoke the above function
scrapeData();
