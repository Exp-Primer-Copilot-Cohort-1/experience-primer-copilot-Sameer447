// Create web server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/comments');

// Create schema
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    username: String,
    comment: String,
    time: Date
});

// Create model
var Comment = mongoose.model('Comment', commentSchema);

// Create parser
var urlencodedParser = bodyParser.urlencoded({extended: false});

// Use static files
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Set view directory
app.set('views', path.join(__dirname, 'views'));

// Get request
app.get('/', function(req, res) {
    Comment.find({}, function(err, data) {
        if (err) throw err;
        res.render('index', {comments: data});
    });
});

// Post request
app.post('/', urlencodedParser, function(req, res) {
    var newComment = Comment(req.body).save(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

// Delete request
app.delete('/:username', function(req, res) {
    Comment.find({username: req.params.username.replace(/\-/g, " ")}).remove(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

// Listen to port 3000
app.listen(3000);
console.log('Server is running on port 3000');
