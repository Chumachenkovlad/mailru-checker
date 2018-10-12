const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('axios');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(bodyParser.json());

app.get('/validate', async (req, res, next) => {
  const {
    query: { email }
  } = req;

  if (!email) {
    res.status(400);
    next();
  }

  try {
    const body = `email=${email}&name=%7B%22first%22%3A%22%22%2C%22last%22%3A%22%22%7D&birthday=%7B%22day%22%3A%22%22%2C%22month%22%3A%22%22%2C%22year%22%3A%22%22%7D&htmlencoded=false&utm=%7B%22source%22%3A%22%22%2C%22medium%22%3A%22%22%2C%22campaign%22%3A%22%22%2C%22term%22%3A%22%22%2C%22content%22%3A%22%22%7D`;

    const { data } = await http.post(
      'https://account.mail.ru/api/v1/user/exists',
      body
    );

    if (data.status !== 200) {
      res.status(data.status);
      next();
    }

    if (!data.body) {
      res.json(data);
      res.status(data.status);
      next();
    }

    if ('exists' in data.body) {
      res.json({ valid: !data.body.exists });
      res.status(200);
      next();
    }

    res.json(checkRes.data.body);
    res.status(200);
    next();
  } catch (e) {
    res.json(e);
    res.status(500);
    next();
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
