var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var socialNetwork = require('../socialNetworksID.json');
//var beforeLoginPage = require('./index').beforeLoginPage;
var beforeLoginPage = '/IMDB250/';
var FACEBOOK_TOKEN;
var TWITTER_TOKEN_COMBINED;

var router = express.Router();


router.use(session({
    secret: 'defaultsecret',
    resave: true,
    saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());



passport.use(new FacebookStrategy({

    clientID: socialNetwork.facebook.clientID,
    clientSecret: socialNetwork.facebook.clientSecret,
    callbackURL: socialNetwork.facebook.callbackURL,
    profileFields: ['id','displayName','emails','gender']

}, function(accessToken, refreshToken, profile, done){

    process.nextTick(function(){

        FACEBOOK_TOKEN = accessToken;
        FACEBOOK_USER = profile._json;
        USER_NAME = FACEBOOK_USER.name.split(" ")[0].toLowerCase();
        module.exports.userName = USER_NAME;
        fbLoggedIn  = true;
        done(null, profile);
    });

}));


passport.use(new TwitterStrategy({
    consumerKey: socialNetwork.twitter.clientID,
    consumerSecret: socialNetwork.twitter.clientSecret,
    callbackURL: socialNetwork.twitter.callbackURL,
    profileFields: ['id','name','gender','emails']
}, function(token, tokenSecret, profile, done){

    process.nextTick(function(){

        var TWITTER_TOKEN = token;
        var TWITTER_TOKEN_SECRET = tokenSecret;
        TWITTER_TOKEN_COMBINED = TWITTER_TOKEN +";"+ TWITTER_TOKEN_SECRET;
        TWITTER_USER = profile._json;
        USER_NAME = TWITTER_USER.name.split(" ")[0].toLowerCase();
        module.exports.userName = USER_NAME;
        twitLoggedIn  = true;
        done(null, profile);
    });

}));


passport.serializeUser( function(user , done){

    done(null, user);
});

passport.deserializeUser( function(obj, done){

    done(null , obj);
});


router.get('/auth/facebook',passport.authenticate('facebook',
    { scope:['email']}
));
router.get('/auth/twitter',passport.authenticate('twitter',
    { scope:['email','name']}
));
router.get('/auth/facebook/callback',
    passport.authenticate('facebook',{
        successRedirect: '/success',
        failureRedirect: '/error'
    }));

router.get('/auth/twitter/callback',
    passport.authenticate('twitter',{
        successRedirect: '/success',
        failureRedirect: '/error'
    }));


router.get('/success',function(req ,res, next){
    //console.log(req.session);
    req.session.name = req.session.passport.user.displayName.split(" ")[0];
    console.log("In passport session");
    req.session.facebookToken = FACEBOOK_TOKEN;
    req.session.twitterToken = TWITTER_TOKEN_COMBINED;
    require('./../Util/cognitoIdentity').cognitoGetIdFunc(req,res,next);

});

exports.router = router;