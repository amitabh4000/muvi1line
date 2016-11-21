xmlHttp = createXmlHttpRequestObject();

function createXmlHttpRequestObject(){

    var xmlHttp;
    if(window.ActiveXObject){
        try{
             xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch(e){
             xmlHttp = false;
        }
    }
    else{
        try{
            xmlHttp = new XMLHttpRequest();
        }
        catch(e){
            xmlHttp = false;
        }
    }
    if(xmlHttp) return xmlHttp;
}
