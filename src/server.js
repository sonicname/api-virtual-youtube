import express from 'express';
import { config } from 'dotenv';
import { request } from './utils/request.js';
import { load } from 'cheerio';
import cors from 'cors';

import { CRAWL_CHARACTER_URL, CRAWL_URL } from './constants/index.js';

config(); // load .env

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' })); //limit 100kb
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.json({
    status: 200,
    message: 'Hello World'
  });
});

app.get('/api/v1/', async (req, res) => {
  try {
    const html = await request(CRAWL_URL);
    const data = [];

    const $ = load(html.toString());

    $('.category-page__member').each(function () {
      data.push({
        name: $(this).find('a.category-page__member-link').text(),
        avatar: $(this)
          .find(
            'div.category-page__member-left > a > img.category-page__member-thumbnail'
          )
          .attr('data-src'),
        slug: `/api/v1/${
          $(this)
            .find('a.category-page__member-link')
            .attr('href')
            .split('/')[3]
        }`
      });
    });

    return res.status(200).json({
      status: 200,
      length: data.length,
      message: data
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      error: e
    });
  }
});

app.get('/api/v1/characters/:characterName', async (req, res) => {
  try {
    const { characterName } = req.params;

    const html = await request(`${CRAWL_CHARACTER_URL}/${characterName}`);
    const $ = load(html.toString());

    return res.json({
      status: 200,
      message: characterName
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Server Error Please Try Again!'
    });
  }
});

app.listen(process.env['PORT'], () => {
  console.log(`App listening on port ${process.env['PORT']}`);
});
