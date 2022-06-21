const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const Download = require('./download');

app.use(cors());
app.options('*', cors()); // to restrict this to one website only, replace the * with your website url
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.send(
    'route: /youtube-download?url=https://youtube.com/watch?v=VIDEOURL&quality=QUALITY&format=mp4/mp3'
  );
});

app.get('/youtube-download', async (req, res, next) => {
  try {
    const videoFormat = req.query.format;
    const data = await Download(req.query.url, req.query.quality, videoFormat);
    res.json({
      status: res.statusCode,
      result: data,
    });
  } catch (error) {
    next(error);
  }
});

// Handle error 404
app.use((req, res, next) => {
  err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Send error message
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    status: error.status || 500,
    message: error.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[SERVER] BERJALAN PADA PORT :${PORT}`);
});
