import { get } from 'https';

export const request = (url) => {
  return new Promise((resolve, reject) => {
    const req = get(url, (res) => {
      if (res.statusCode !== 200) reject(`Request error with status code ${res.statusCode}!`);
      res.setEncoding('utf8');
      let body = '';

      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(body));
    });

    req.on('error', (e) => reject(e.message));
  });
};
