/**
 * Created by SAmitabh on 21-09-2016.
 */

    function userRegister() {
        name = $("#form-name").val();
        username = $("#form-username").val();
        password = $("#form-password").val();
        email = $("#form-email").val();
        console.log("In userRegister function");
        var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
        var poolData = {
            UserPoolId: 'us-west-2_BViaq7pfy', // Your user pool id here
            ClientId: '2ifb75dklu6erps9hm2u3jpcnl' // Your client id here
        };
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var attributeList = [];
        var data
        var dataName = {
            Name: 'name',
            Value: name
        };
        var dataUsername = {
            Name: 'preferred_username',
            Value: username
        };
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
        var attributePreferredUsername = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataUsername);
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

        attributeList.push(attributeName);
        attributeList.push(attributePreferredUsername);
        attributeList.push(attributeEmail);

        userPool.signUp(username, password, attributeList, null, function (err, result) {
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is: ' + cognitoUser.getUsername());
            setTimeout(function(){

                var poolData = {
                    UserPoolId: 'us-west-2_BViaq7pfy', // Your user pool id here
                    ClientId: '2ifb75dklu6erps9hm2u3jpcnl' // Your client id here
                };
                var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
                console.log(userPool.getCurrentUser())
                var cognitoUser = userPool.getCurrentUser();
                if (cognitoUser != null) {
                    cognitoUser.getSession(function(err, result) {
                        if (result) {
                            console.log('You are now logged in.');

                            // Add the User's Id Token to the Cognito credentials login map.
                            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                                IdentityPoolId : 'us-west-2:ece955c2-a8a8-40f6-8984-514542c04598', // your identity pool id here
                                Logins : {
                                    // Change the key below according to the specific region your user pool is in.
                                    'cognito-idp.us-west-2.amazonaws.com/us-west-2_BViaq7pfy' : result.getIdToken().getJwtToken()
                                }
                            });
                        }
                        else{
                            console.log("result not working");
                        }
                    });
                }
                else{
                    console.log("user not present");
                }
            },2500);


        });
    }

function authenticateAndEstablishSession (){
    var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
    console.log("In authentication ")
    var username = $("#username").val();
    var password = $("#pwd").val();
//        var email = $("#form-email").val();
    var authenticationData = {
        Username : username,
        Password : 'Suman123'
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId : 'us-west-2_BViaq7pfy', // Your user pool id here
        ClientId : '2ifb75dklu6erps9hm2u3jpcnl' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    console.log("Authentication details is: ");
    console.log(authenticationDetails);
    console.log("cognito user is: ");
    console.log(cognitoUser);
    console.log("reached after jquery "+password+" username is: "+username);

    cognitoUser.authenticateUser(
        authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
//                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//                    IdentityPoolId : 'us-west-2:ece955c2-a8a8-40f6-8984-514542c04598', // your identity pool id here
//                    Logins : {
//                        // Change the key below according to the specific region your user pool is in.
//                        'cognito-idp.us-west-2.amazonaws.com/us-west-2_BViaq7pfy' : result.getIdToken().getJwtToken()
//                    }
//                });

                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();

            },

            onFailure: function(err) {
                console.log("error");
                alert(err);
            },

        });
    console.log("reached after authentication");

}
