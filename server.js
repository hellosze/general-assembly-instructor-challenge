var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var request = require("request");
var router = express.Router();


app.set('view engine', 'pug');
app.set('views', './views');


app.set('views', './views');
app.get('/', function(req, res){
  res.render('index', { title: "OMDB API Client 2.0" } );
});

app.get('/search', function(req, res){
  res.render('search', { title: "OMDB API Client 2.0" } );
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.post('/search-movies', (req, res) => {
  url = 'http://www.omdbapi.com/?s='+req.body.movie+'&apikey=d87f2ee5'
  console.log(url);
  request(url, { json: true }, (err, result, body) => {
  if (err) { return console.log(err); }
    res.render('omdb-content',{ omdb_results: body.Search });
  });
})

app.get('/favorites', function(req, res){
  var data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('favorites', function(req, res){
  if(!req.body.name || !req.body.oid){
    res.send("Error");
    return
  
  var data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});