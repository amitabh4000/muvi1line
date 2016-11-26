var express = require('express');
var imdb250 = require('./imdb250');
var router = express.Router();
var session = require('express-session');

/// import objects and models
var socialNetwork = require('../socialNetworksID.js');
var User = require('../models/user.js');
var passport = require('passport');

////// Passport Strategies
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var AWS = require('aws-sdk');
var colors = require('colors');
var flash = require('connect-flash');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var AWS_ACCOUNT_ID = '144186234075';
var AWS_Region = 'us-east-1';
var COGNITO_IDENTITY_POOL_ID = 'us-east-1:20829922-2088-44ad-9eff-581e014408f3';
var COGNITO_IDENTITY_ID ,COGNITO_SYNC_TOKEN, AWS_TEMP_CREDENTIALS;
var IAM_ROLE_ARN = 'arn:aws:iam::144186234075:role/Cognito_movieinalineAuth_Role';
var COGNITO_SYNC_COUNT;
var COGNITO_DATASET_NAME = 'USER_NAME';

var USER_NAME;

AWS.config.region = AWS_Region;
var params ={
    AccountId: AWS_ACCOUNT_ID,
    RoleArn: IAM_ROLE_ARN,
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
    Logins: {
        'graph.facebook.com': FACEBOOK_TOKEN,
        'api.twitter.com': TWITTER_TOKEN_COMBINED,
        'login.movieinaline.myapp': '12345678'
    }
};
AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

fbLoggedIn = false;
twitLoggedIn = false;
var cognitoidentity = new AWS.CognitoIdentity();

/// Initialize the TOKENS //////
var TWITTER_TOKEN_COMBINED;
var FACEBOOK_TOKEN;
var FACEBOOK_USER;

///// Session ////

router.use(session({
    secret: 'defaultsecret',
    resave: true,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

// Code for Passport authentication ///////


///// PassportJS Facebook ///////
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

///// End Facebook ///////////////



// passport.serializeUser( function(user , done){
//
//     done(null, user);
// });
//
// passport.deserializeUser( function(id, done){
//
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });
//// PassportJS Twitter ////////////////////

passport.use(new TwitterStrategy({

    consumerKey: socialNetwork.twitter.clientID,
    consumerSecret: socialNetwork.twitter.clientSecret,
    callbackURL: socialNetwork.twitter.callbackURL,
    profileFields: ['id','name','gender','emails']

}, function(token, tokenSecret, profile, done){

    process.nextTick(function(){

        TWITTER_TOKEN = token;
        TWITTER_TOKEN_SECRET = tokenSecret;
        TWITTER_TOKEN_COMBINED = TWITTER_TOKEN +";"+ TWITTER_TOKEN_SECRET;
        TWITTER_USER = profile._json;
        USER_NAME = TWITTER_USER.name.split(" ")[0].toLowerCase();
        module.exports.userName = USER_NAME;
        twitLoggedIn  = true;
        done(null, profile);
    });

}));
///// End Twitter ////////////////

passport.serializeUser( function(user , done){

    done(null, user);
});

passport.deserializeUser( function(obj, done){

    done(null , obj);
});


/* GET Social-networks page. */


/// Facebook
router.get('/auth/facebook',passport.authenticate('facebook',{ scope:['email']}));

/// Twitter
router.get('/auth/twitter',passport.authenticate('twitter',{ scope:['email','name']}));


/* GET social-network callback page. */

/// Facebook
router.get('/auth/facebook/callback',
    passport.authenticate('facebook',{
        successRedirect: '/success',
        failureRedirect: '/error'
    }));
//// Twitter
router.get('/auth/twitter/callback',
    passport.authenticate('twitter',{
        successRedirect: '/success',
        failureRedirect: '/error'
    }));



router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/success', // redirect to the secure profile section
    failureRedirect : '/error', // redirect back to the signup page if there is an error
    //failureFlash : true // allow flash messages
}));
/* GET Facebook success page. */

router.get('/success',function(req ,res, next){

    console.log('in success')
    getCognitoId();

    res.redirect('/IMDB250');
});
/*   End of authentication with Facebook using passport JS   */


function getCognitoId(){
    var params ={
        AccountId: AWS_ACCOUNT_ID,
        RoleArn: IAM_ROLE_ARN,
        IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
        Logins: {
            'graph.facebook.com': FACEBOOK_TOKEN,
            'api.twitter.com': TWITTER_TOKEN_COMBINED,
        }
    };
    AWS.config.region = AWS_Region;
    /* initialize the Credentials object */
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
    /* Get the credentials for our user */
    AWS.config.credentials.get(function(err){
        if(err) console.log("credentials.get: ".red + err,err.stack);
        else{
            AWS_TEMP_CREDENTIALS = AWS.config.credentials.data.Credentials;
            COGNITO_IDENTITY_ID = AWS.config.credentials.identityId;
            console.log("Cognito Identity Id: ".green + COGNITO_IDENTITY_ID);
            console.log("cog id: " + COGNITO_IDENTITY_ID);
            module.exports.cognitoId = COGNITO_IDENTITY_ID;
            getCognitoSynToken();
        }
    });

}


function getCognitoSynToken(){

/* Other AWS SDKs will automatically use the Cognito Credentials provider */
    /* configured in the JavaScript SDK. */
    cognitosync = new AWS.CognitoSync();
    cognitosync.listRecords({
        DatasetName: COGNITO_DATASET_NAME,
        IdentityId: COGNITO_IDENTITY_ID,
        IdentityPoolId:COGNITO_IDENTITY_POOL_ID
    },function(err , data){
        if(err) console.log("listRecords: ".red +err ,err.stack);
        else{
            console.log("listRecords".green + JSON.stringify(data));
            COGNITO_SYNC_TOKEN = data.SyncSessionToken;
            COGNITO_SYNC_COUNT = data.DatasetSyncCount;
            console.log("Sync Session token ".green + COGNITO_SYNC_TOKEN);
            console.log("Sync Session count ".green + COGNITO_SYNC_COUNT);
            addRecord();
        }
    })
}

function addRecord(){
    var params = {
        DatasetName: COGNITO_DATASET_NAME,
        IdentityId: COGNITO_IDENTITY_ID,
        IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
        SyncSessionToken: COGNITO_SYNC_TOKEN,
        RecordPatches:[
            {
                Key: 'name',
                Op: 'replace',
                SyncCount: COGNITO_SYNC_COUNT,
                Value: USER_NAME
            }
        ]
    };
    console.log("USERNAME IS:  "+USER_NAME);
    cognitosync.updateRecords(params , function(err , data){
        if(err) console.log("updateRecord".red + err , err.stack);
        else console.log("Value ".green + JSON.stringify(data));
    });
}



router.get('/login',function(req,res,next){
    res.render('login');
});

router.post('/ajax',function(req,res,next){
    res.render('login');
});
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('mainpage' , movieArr);
// });

/* GET IMDB250 page. */
router.use('/IMDB250' , imdb250);

module.exports = {router:router,cognitoId:COGNITO_IDENTITY_ID,
                 poolId:COGNITO_IDENTITY_POOL_ID,userName:USER_NAME};


