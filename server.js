// ************** Modules ************** //
const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cors = require('cors');

// ************* Variables ************* //
const PORT = process.env.PORT || 8000;
const { reactors } = require('./public/js/reactors-data-1');
const scrape = require('./public/js/scrape');
const handleData = require('./public/js/dataMerge')

// ************* Middleware ************ //
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// *********** CRUD framework *********** //
// Default path '/' -- servers up (GETS) the 'index.ejs' file and required data
app.get('/', function (request, response) {
  response.render('index', { reactorsArr: reactors });
});

// path '/about' -- GETS the '/about.html' file and required data
app.get('/about', function (request, response) {
  response.render('about', { reactorsArr: reactors });
});

// path '/api/' -- GETS the adv. reactors API - Not filtered
app.get('/api/', (request, response) => {
  // save request to reactorName and converts to lowerCase
  response.json(reactors);
});

// path '/api/:name' -- GETS the adv. reactors API - filtered by NAME
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

// ******* Web Scraper 1.0 (Cheerio + Puppeteer) ******* //
// scrape.scrapeOverview();
// scrape.scrapeGeneral();
// scrape.scrapeNsss();
// scrape.scrapeRcs();
// scrape.scrapeCore();
// scrape.scrapeMaterial();
// scrape.scrapeRpv();


// Merge Data into one json file
handleData.mergeData();