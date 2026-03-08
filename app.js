const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Categories for top headlines
const categories = [
  'general',
  'technology',
  'sports',
  'business',
  'science',
  'health',
  'entertainment'
];

// Fetch news from NewsAPI
function fetchNews(category) {
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.API_KEY}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const articles = JSON.parse(data).articles || [];
          resolve(articles.slice(0, 25)); // limit to 25 articles
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Home route
app.get('/', async (req, res) => {
  try {
    const results = await Promise.all(categories.map(fetchNews));
    res.render('main', {
      data1: results[0],
      data2: results[1],
      data3: results[2],
      data4: results[3],
      data5: results[4],
      data6: results[5],
      data7: results[6],
    });
  } catch (err) {
    console.error(err);
    res.send('Error fetching news');
  }
});

// Category route
app.get('/:type', async (req, res) => {
  const typeIndex = parseInt(req.params.type);
  if (isNaN(typeIndex) || typeIndex < 0 || typeIndex >= categories.length) {
    return res.status(404).send('Category not found');
  }
  try {
    const articles = await fetchNews(categories[typeIndex]);
    res.render('news', { title: categories[typeIndex], data1: articles });
  } catch (err) {
    console.error(err);
    res.send('Error fetching news');
  }
});

// Search route
app.post('/search', (req, res) => {
  const query = req.body.input?.trim();
  if (!query) return res.redirect('/');

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.API_KEY}`;
  let data = '';

  https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (response) => {
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const articles = JSON.parse(data).articles || [];
        if (!articles.length) return res.render('failure');
        res.render('search', { searchtitle: query, datasearch: articles.slice(0, 30) });
      } catch {
        res.render('failure');
      }
    });
  }).on('error', () => res.render('failure'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));