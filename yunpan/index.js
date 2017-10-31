const path = require('path');
const express = require('express');
const hbs = require('hbs');
var bodyParser = require('body-parser')

const app = express();

const PORT = 8080;

app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'assets')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index')
})



// ----------------------------------------------------------
// ajax 跨域接口
app.get('/ajax_cross_domain', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('ok');
});

app.post('/ajax_cross_domain', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log(req.body);
  res.send('ok');
})

app.get('/jsonp_test', (req, res) => {
  let data = JSON.stringify({a: 1, b: 2});

  let cb = req.query.cb;

  console.log(cb);

  res.send(`${cb}(${data})`);
});

// ----------------------------------------------------------


app.use((req, res, next) => {
  res.status(404);
  res.send('404 Not Found!');
});

app.use((err, req, res, next) => {
  res.status(500);
  res.send('500 Server Error!');
})

app.listen(PORT, (err) => {
  if(err){
    console.log(err);
  }
  console.log(`Server is running at PORT: ${PORT}`);
})
