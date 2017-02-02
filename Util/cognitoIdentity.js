
var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var config = require('./config');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var AWS_ACCOUNT_ID = '144186234075';
var AWS_Region = 'us-east-1';
var COGNITO_IDENTITY_POOL_ID = 'us-east-1:20829922-2088-44ad-9eff-581e014408f3';
var COGNITO_IDENTITY_ID ,COGNITO_SYNC_TOKEN, AWS_TEMP_CREDENTIALS;
var IAM_ROLE_ARN = 'arn:aws:iam::144186234075:role/Cognito_movieinalineAuth_Role';
var COGNITO_SYNC_COUNT;
var COGNITO_DATASET_NAME = 'USER_NAME';


var cognitoGetIdFunc = function (req,res,next){
    var params ={
        AccountId: config.aws.accountId,
        RoleArn: config.aws.IAM_ROLE_ARN,
        IdentityPoolId: config.cognito.identityPoolId,
        Logins: {
            'graph.facebook.com': req.session.facebookToken,
            'api.twitter.com': req.session.twitterToken,
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_t58MAl0N4':req.session.localToken
        }
    };
    console.log("Inside cognitoIdget")
    //console.log(req.session);
    AWS.config.region = config.aws.region;
    /* initialize the Credentials object */
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
    /* Get the credentials for our user */
    AWS.config.credentials.get(function(err){
        if(err) console.log("credentials.get: ".red + err,err.stack);
        else{
            //console.log("Cognito ID success")
            //console.log("Cognito ID id: "+AWS.config.credentials.identityId)
            AWS_TEMP_CREDENTIALS = AWS.config.credentials.data.Credentials;
            COGNITO_IDENTITY_ID = AWS.config.credentials.identityId;
            //console.log("Cognito ID id: "+COGNITO_IDENTITY_ID)
            //console.log("Cognito Identity Id: ".green + COGNITO_IDENTITY_ID);
            //module.exports.cognitoId = COGNITO_IDENTITY_ID;
            req.session.cognitoId = COGNITO_IDENTITY_ID;
            res.redirect(req.session.beforeLoginPage ? req.session.beforeLoginPage : '/IMDB250');
        }
    });

}


var cognitoPatchRecordFunc = function (req,res,next){
    console.log("Inside cognitoPatch ")
    console.log("cognito Id is: "+req.session.cognitoId)
    /* Other AWS SDKs will automatically use the Cognito Credentials provider */
    /* configured in the JavaScript SDK. */
    cognitosync = new AWS.CognitoSync();
    cognitosync.listRecords({
        DatasetName: config.cognito.movieDataset.name,
        IdentityId: req.session.cognitoId,
        IdentityPoolId: config.cognito.identityPoolId,
    },function(err , data){
        if(err) console.log("listRecords: ".red +err ,err.stack);
        else{
            console.log("Inside patch success")
            console.log(data);
            req.session.movieRecord = data;
            console.log(req.session.movieRecord.Records[0].Value);
            req.session.cognitoSyncToken = data.SyncSessionToken;
            req.session.syncCount= data.DatasetSyncCount;
            console.log("Sync Session token ".green + req.session.cognitoSyncToken);
            console.log("Sync Session count ".green + req.session.syncCount);
        }
    });
}

var cognitoUpdateRecordFunc = function (req,res,next,key,op,val){

    cognitosync = new AWS.CognitoSync();
    cognitosync.listRecords({
        DatasetName: config.cognito.movieDataset.name,
        IdentityId: req.session.cognitoId,
        IdentityPoolId: config.cognito.identityPoolId,
    },function(err , data) {
        if (err) console.log("listRecords: ".red + err, err.stack);
        else {
            console.log("Get SyncCount before update")
            console.log(data);
            req.session.movieRecord = data;
            console.log(req.session.movieRecord.Records[0].Value);
            req.session.cognitoSyncToken = data.SyncSessionToken;
            req.session.syncCount = data.DatasetSyncCount;
        }
    })
    var params = {
        DatasetName: config.cognito.movieDataset.name,
        IdentityId: req.session.cognitoId,
        IdentityPoolId: config.cognito.identityPoolId,
        SyncSessionToken: req.session.cognitoSyncToken,
        RecordPatches:[
            {
                Key: key,
                Op: op,
                SyncCount: req.session.syncCount,
                Value: val
            }
        ]
    };
    cognitosync.updateRecords(params , function(err , data){
        if(err) console.log("updateRecord".red + err , err.stack);
        else console.log("Value ".green + JSON.stringify(data));
    });
    cognitoPatchRecordFunc(req,res,next);
}

exports.cognitoGetIdFunc = cognitoGetIdFunc;
exports.cognitoPatchRecordFunc = cognitoPatchRecordFunc;
exports.cognitoUpdateRecordFunc = cognitoUpdateRecordFunc;