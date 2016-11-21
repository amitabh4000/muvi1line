

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var connection = require('../app').connection;
var userSchema = mongoose.Schema({
    local:{
        name:String,
        username:String,
        email:String,
        password:String,
        authCode:String
    }
});
///// methods

///// Generate Hash for password ////

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);

};

//// Checking if password is valid

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password)
};
//var User = connection.model('Usernnn', userSchema);
var User2 = mongoose.model('Usernnn', userSchema);
//     var newUser = new User({local:{email: 'dddddd',
// password: 'eeeee'}});
//
//     newUser.save(function (err) {
//         if (err)
//             throw err;
//         console.log('user added');
//     });
// console.log('after save');
module.exports = User2;