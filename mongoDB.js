/**
 * Created by SAmitabh on 03-09-2016.
 */



var mongoose = require('mongoose');

// mongolab

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
    user: 'amitabh4000', pass: 'Suman.123' };

var mongodbUri = 'mongodb://ds033076.mlab.com:33076/movie_in_a_line_db';
var mongooseUri = require('mongodb-uri').formatMongoose(mongodbUri);

mongoose.connect(mongooseUri,options);


//mongoose.connect('mongodb://localhost/mongoDB');
var movieDB = mongoose.connection;
movieDB.on('error', console.error.bind(console, 'connection error:'));
movieDB.once('open', function() {
    console.log("we're connected!")
});

// Create a schema
var movieSchema = new mongoose.Schema({
    _id:String,
    movieId :String,
    name: String,
    comments: [{userId:String,username:String,body:String,likes:Number,date: Date }],
    likes: Number
});
// Create a model based on the schema
var Movie = mongoose.model('Movie', movieSchema);
Movie.create({_id:"hhyy",movieId:321,name:"The Godfather"},function (err,doc) {
});

// var movie = new Movie({movieId:321,name:"The Godfather"});
// movie.save(function (err) {
//
// });
module.exports = {moviemodel:Movie, mongooseOptions:options, mongooseUri:mongooseUri};