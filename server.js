// var http = require("http");
// http.createServer(function(request, response){
// 	response.writeHead(200, {
// 		'Content-Type': 'text/plain'
// 	});
// 	response.end('Hello World !...');
// }).listen(7890);

// console.log("Server created at http://localhost:7890");

var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'crash_app'
});

app.set('port', 7890);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extend: false}));

app.get('/', function (req, res) {
    console.log(req.session.last_page);
    req.session.last_page = 'index page';
    connection.query('SELECT * FROM cart', function (err, rows) {
        // console.log(rows);
        res.render('index', {
            items: rows
        });
    });
});

app.get('/test', function(req, res){
    res.send(req.session.last_page);
});

app.post('/addItem', function (req, res) {
    var data = {
        itemno: req.body.itemno,
        itemname: req.body.itemname,
        qty: req.body.qty
    };
    connection.query('INSERT INTO cart SET ?', data, function (err, res) {
        if (err) throw  err;
    });
    res.redirect('/');
});

app.post('/updateItem', function (req, res) {
    var id = req.body.id;
    var itemno = req.body.itemno;
    var itemname = req.body.itemname;
    var qty = req.body.qty;
    connection.query('UPDATE cart SET itemno = ?, itemname = ?, qty = ? WHERE id = ?', [itemno, itemname, qty, id], function (err, rows) {
        if (err) throw  err;
            console.log('error selecting : %s', err);
    });
    res.redirect('/');
});

app.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM cart WHERE id = ?', [id], function (err, rows) {
        if (err) throw  err;
            console.log('error selecting : %s', err);
    });
    res.redirect('/');
});

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));