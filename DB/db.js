


var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
    user: 'amitabh4000', pass: 'Suman.123' };

var mongodbUri = 'mongodb://ds033076.mlab.com:33076/movie_in_a_line_db';
var mongooseUri = require('mongodb-uri').formatMongoose(mongodbUri);

module.exports  ={uri:mongooseUri,options:options};